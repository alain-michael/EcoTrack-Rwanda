# cloudinary_utils.py

import cloudinary.uploader

def upload_to_cloudinary(file_to_upload):

    cloud_name = 'dxeepn9qa'
    api_key = '396133459978945'
    api_secret = 'lij0YD3ThmYd_dPkBwpfSAplWxk'
    
    try:
        result = cloudinary.uploader.upload(
            file_to_upload, 
            folder='eco-track',
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret
        )
        return result.get('secure_url')
    except Exception as e:
        # Log the error or handle it as needed
        print(e)
        return None
