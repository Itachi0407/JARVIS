import kagglehub
import os
import shutil

print("Downloading Gemma 2B model for MediaPipe...")
print("If this fails, you may need to set your KAGGLE_USERNAME and KAGGLE_KEY environment variables.")

try:
    # Download the model
    path = kagglehub.model_download("google/gemma/tfLite/gemma-2b-it-gpu-int4")
    print("Downloaded successfully to:", path)
    
    # Check if the file is there
    for root, dirs, files in os.walk(path):
        for file in files:
            if file.endswith('.bin'):
                source_file = os.path.join(root, file)
                dest_file = os.path.join(os.path.expanduser("~"), "Downloads", "gemma-2b-it-gpu-int4.bin")
                shutil.copy2(source_file, dest_file)
                print(f"Copied to {dest_file} so you can easily push it.")
                print(f"Run this command to push to your phone:")
                print(f"adb push {dest_file} /sdcard/Download/gemma-2b-it-gpu-int4.bin")
                exit(0)
except Exception as e:
    print(f"Error downloading: {e}")
    print("Please make sure you have accepted the Gemma terms on Kaggle and are authenticated.")
