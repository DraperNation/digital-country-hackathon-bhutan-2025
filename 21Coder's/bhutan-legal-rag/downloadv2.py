import requests
from tqdm import tqdm

# Expanded dictionary of Bhutan legal documents with URLs
docs = {
    "Constitution of Bhutan 2008": "https://www.constitution.bt/wp-content/uploads/2011/02/Constitution-of-Bhutan-2008.pdf",
    "Anti-Corruption Act 2011": "https://oag.gov.bt/wp-content/uploads/2018/07/Anti-Corruption-Act-2011.pdf",
    "Penal Code 2004": "https://rbp.gov.bt/wp-content/uploads/2025/03/PCB-2004.pdf",
    "Civil and Criminal Procedure Code 2001": "https://oag.gov.bt/wp-content/uploads/2018/07/Civil-and-Criminal-Procedure-Code-2001.pdf",
    "Evidence Act 2005": "https://oag.gov.bt/wp-content/uploads/2018/07/Evidence-Act-2005.pdf",
    "Tax Act 2022": "https://oag.gov.bt/wp-content/uploads/2023/01/Tax-Act-2022.pdf",
    "Land Act 2007": "https://oag.gov.bt/wp-content/uploads/2018/07/Land-Act-2007.pdf",
    "Environment Protection Act 2007": "https://oag.gov.bt/wp-content/uploads/2018/07/Environment-Protection-Act-2007.pdf",
    "Labour and Employment Act 2007": "https://oag.gov.bt/wp-content/uploads/2018/07/Labour-and-Employment-Act-2007.pdf",
    "Marriage Act 1980": "https://oag.gov.bt/wp-content/uploads/2018/07/Marriage-Act-1980.pdf",
    "Companies Act 2000": "https://oag.gov.bt/wp-content/uploads/2018/07/Companies-Act-2000.pdf",
    "Income Tax Act 2001": "https://oag.gov.bt/wp-content/uploads/2018/07/Income-Tax-Act-2001.pdf",
    "Foreign Exchange Act 2019": "https://oag.gov.bt/wp-content/uploads/2020/01/Foreign-Exchange-Act-2019.pdf",
    "Intellectual Property Act 2001": "https://oag.gov.bt/wp-content/uploads/2018/07/Intellectual-Property-Act-2001.pdf",
    "Road Safety Act 2012": "https://oag.gov.bt/wp-content/uploads/2018/07/Road-Safety-Act-2012.pdf",
    "Child Care and Protection Act 2011": "https://oag.gov.bt/wp-content/uploads/2018/07/Child-Care-and-Protection-Act-2011.pdf",
    "Juvenile Justice Act 2011": "https://oag.gov.bt/wp-content/uploads/2018/07/Juvenile-Justice-Act-2011.pdf",
    "Right to Information Act 2016": "https://oag.gov.bt/wp-content/uploads/2018/07/Right-to-Information-Act-2016.pdf",
    "Public Health Act 2005": "https://oag.gov.bt/wp-content/uploads/2018/07/Public-Health-Act-2005.pdf",
    "Forest and Nature Conservation Act 1995": "https://oag.gov.bt/wp-content/uploads/2018/07/Forest-and-Nature-Conservation-Act-1995.pdf",
    "Electricity Act 2001": "https://oag.gov.bt/wp-content/uploads/2018/07/Electricity-Act-2001.pdf",
    "Telecommunications Act 2006": "https://oag.gov.bt/wp-content/uploads/2018/07/Telecommunications-Act-2006.pdf",
    "Drugs Act 2003": "https://oag.gov.bt/wp-content/uploads/2018/07/Drugs-Act-2003.pdf",
    "Immigration Act 2007": "https://oag.gov.bt/wp-content/uploads/2018/07/Immigration-Act-2007.pdf",
    "Water Act 2011": "https://oag.gov.bt/wp-content/uploads/2018/07/Water-Act-2011.pdf"
}

def download_document(name, url):
    try:
        print(f"Downloading: {name}")
        response = requests.get(url, stream=True)
        response.raise_for_status()
        total_size = int(response.headers.get('content-length', 0))
        filename = name.replace(" ", "_").replace("/", "_") + ".pdf"
        block_size = 1024  # 1 KB

        with open(filename, 'wb') as file, tqdm(
            total=total_size, unit='B', unit_scale=True, desc=filename, ncols=80
        ) as progress_bar:
            for data in response.iter_content(block_size):
                file.write(data)
                progress_bar.update(len(data))
        print(f"Saved: {filename}\n")
    except requests.RequestException as e:
        print(f"Failed to download {name}: {e}\n")

if __name__ == "__main__":
    print("Starting download of Bhutan legal documents...\n")
    for doc_name, doc_url in docs.items():
        download_document(doc_name, doc_url)
    print("All downloads completed.")
