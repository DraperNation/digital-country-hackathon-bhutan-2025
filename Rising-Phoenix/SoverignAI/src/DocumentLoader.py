import glob
import os

from src.utils.logger import SingletonLogger

# Get the logger instance
logger_instance = SingletonLogger()
logger = logger_instance.get_logger()


class DocumentLoader:
    def __init__(self, raw_path: str, file_extension: str = ".pdf"):
        self.raw_path = raw_path
        self.file_extension = file_extension

    def load_pdf_files_path(self):
        """
        Finds all PDF files in a directory and its subdirectories.

        Args:
        - directory (str): Directory path to search

        Returns:
        - list: List of absolute paths to PDF files
        """
        logger.info("Loading PDF files paths...")
        pdf_files = []
        search_path = os.path.join(self.raw_path, "**/*.pdf")  # Recursive search for PDF files
        for file_path in glob.glob(search_path, recursive=True):
            pdf_files.append(os.path.abspath(file_path))  # Convert to absolute path
        logger.info(f"PDF files loaded - {pdf_files}")
        return pdf_files


# Testing out this functionality:
# if __name__ == '__main__':
#     document_loader = DocumentLoader(raw_path='../data/raw')
#     pdf_files = document_loader.load_pdf_files_path()
#     print(pdf_files)
#
