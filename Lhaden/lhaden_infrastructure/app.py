from pydantic import BaseModel, EmailStr, ValidationError
import time
import logging as logger
import hmac
from functions.modify_user_info_in_db import modify_user_info_in_db
from functions.otp_system import generate_otp, hmac_tag, encode_token, decode_token
from functions.check_email_in_db import check_email_in_db
from functions.send_email_verification import send_email_for_verification
from functions.store_user_info_in_db import store_user_info_in_db
from functions.delete_user_account import delete_user_account
from functions.load_user_details import load_user_details
from functions.retrieve_notifications_list import retrieve_notifications_list
from functions.lhaden_core import lhaden_core
from functions.delete_notifications_list_for_user import delete_notifications_list_for_user
from flask import Flask, jsonify, request

app = Flask(__name__)


class DeleteAccountRequest(BaseModel):
    email_id: EmailStr


class LhadenCoreRequest(BaseModel):
    email_id: EmailStr
    user_query: str


class EmailBody(BaseModel):
    email: EmailStr


class UpdateBody(BaseModel):
    email_id: EmailStr
    name: str
    account_type: str


class VerifyBody(EmailBody):
    otp: str
    token: str


@app.route('/send-email-otp', methods=['POST', 'GET'])
def send_email_otp():
    try:
        body = EmailBody(**request.get_json())
    except (ValidationError, TypeError):
        return jsonify({"error": "Invalid e-mail payload"}), 400

    email = body.email.lower()
    otp = generate_otp()
    ts = int(time.time())

    payload = f"{email}|{otp}|{ts}".encode()
    tag = hmac_tag(payload)
    token = encode_token(payload, tag)

    try:
        send_email_for_verification(email, otp)
    except Exception as e:
        logger.error("SMTP error: %s", e)
        return jsonify({"success": False, "detail": "Email send failed"}), 502

    logger.info("OTP sent to %s", email)
    return jsonify({"success": True, "token": token, "ttl": 120}), 200


@app.route('/verify-email-otp', methods=['POST', 'GET'])
def verify_email_otp():
    # 1️⃣ Parse & validate JSON body
    try:
        body = VerifyBody(**request.get_json())
    except (ValidationError, TypeError):
        return jsonify({"error": "Invalid payload"}), 399

    email = body.email.lower()
    otp = body.otp.strip()
    token = body.token

    # 2️⃣ Decode token and verify HMAC tag
    try:
        payload, tag = decode_token(token)  # bytes, bytes
        if not hmac.compare_digest(tag, hmac_tag(payload)):
            raise ValueError("bad tag")

        p_email, p_otp, p_ts = payload.decode().split("|")
        p_ts = int(p_ts)
    except Exception as e:
        print(e)
        print("detail", "Token invalid")
        return jsonify({"valid": False, "detail": "Token invalid"}), 401

    # 3️⃣ Consistency checks
    if p_email != email or p_otp != otp:
        print("detail", "OTP / e-mail mismatch")
        return jsonify({"valid": False, "detail": "OTP / e-mail mismatch"}), 402

    if time.time() - p_ts > 120:
        print("detail", "OTP expired")
        return jsonify({"valid": False, "detail": "OTP expired"}), 469

    # 4️⃣ Database lookup – are they already registered?
    user_exists = check_email_in_db(email)  # True if row found
    new_user = not user_exists

    logger.info("OTP verified for %s (new_user=%s)", email, new_user)
    return jsonify({"valid": True, "new_user": new_user}), 200


@app.route('/store-user-info', methods=['POST', 'GET'])
def store_user_info():
    try:
        user_data = request.get_json()
        if not user_data:
            raise ValueError("No JSON data provided")
        result = store_user_info_in_db(user_data)
        return jsonify({"result": result}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": str(e)}), 500


@app.route('/get-notifications', methods=['POST', 'GET'])
def get_notifications():
    try:
        data = request.get_json()
        if not data:
            raise ValueError("No JSON data provided")
        notifications = retrieve_notifications_list(data['email_id'])
        return jsonify(notifications), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'message': str(e)}), 500


@app.route('/delete-notifications', methods=['POST', 'GET'])
def delete_notifications():
    try:
        data = request.get_json()
        if not data:
            raise ValueError("No JSON data provided")
        result = delete_notifications_list_for_user(data['email_id'])
        return jsonify({'result': result}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'message': str(e)}), 500


@app.route('/get-user-data', methods=['POST', 'GET'])
def get_user_data():
    try:
        data = request.get_json()
        if not data:
            raise ValueError("No JSON data provided")
        user_details = load_user_details(data['email_id'])
        return jsonify(user_details), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": str(e)}), 500


@app.route("/update-user-data", methods=["POST"])
def update_user_data():
    try:
        body = UpdateBody(**request.get_json())
    except (ValidationError, TypeError):
        return jsonify({"success": False, "detail": "Invalid payload"}), 400

    try:
        ok = modify_user_info_in_db(body.model_dump())
        return jsonify({"success": ok}), 200 if ok else 500

    except ValueError as ve:
        return jsonify({"success": False, "detail": str(ve)}), 400
    except RuntimeError as re:
        logger.error(re, exc_info=True)
        return jsonify({"success": False, "detail": "Database error"}), 502
    except Exception as e:
        logger.error("Unexpected error: %s", e, exc_info=True)
        return jsonify({"success": False, "detail": "Server error"}), 500


@app.route('/delete-account', methods=['POST', 'GET'])
def delete_account_api():
    # 1️⃣ Validate
    try:
        payload = DeleteAccountRequest(**request.get_json())
    except (ValidationError, TypeError):
        return jsonify({"success": False, "detail": "Invalid payload"}), 400

    # 2️⃣ Perform deletion
    try:
        count = delete_user_account(payload.email_id)
        if count == 0:
            return jsonify({"success": False, "detail": "No data found for this account"}), 404
        return jsonify({"success": True, "deleted_rows": count}), 200

    except Exception as e:
        logger.error("delete-account API error for %s: %s", payload.email_id, e, exc_info=True)
        return jsonify({"success": False, "detail": "Server error"}), 500


# app.py
@app.route("/healthz")
def healthz():
    return "OK", 200


@app.route('/get-system-response', methods=['POST', 'GET'])
def get_system_response():
    # 1️⃣ Validate payload
    try:
        body = LhadenCoreRequest(**request.get_json())
    except (ValidationError, TypeError):
        return jsonify({"success": False, "detail": "Invalid payload"}), 400

    # 2️⃣ Invoke core logic
    try:
        result = lhaden_core(body.email_id, body.user_query)

        # Ensure the result is JSON‑serialisable; convert to str if needed
        if not isinstance(result, (dict, list)):
            result = str(result)

        return jsonify({"success": True, "response": result}), 200

    # 3️⃣ Error handling
    except ValueError as ve:
        return jsonify({"success": False, "detail": str(ve)}), 400
    except RuntimeError as re:
        logger.error("lhaden_core runtime error: %s", re, exc_info=True)
        return jsonify({"success": False, "detail": "Runtime error"}), 502
    except Exception as e:
        logger.error("Unexpected error in /run-lhaden-core: %s", e, exc_info=True)
        return jsonify({"success": False, "detail": "Server error"}), 500
