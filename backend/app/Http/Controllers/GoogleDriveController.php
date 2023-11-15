<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Google\Service\Oauth2;
use Google\Service\Drive;
use Google\Service\Drive\DriveFile;


class GoogleDriveController extends Controller
{
    public $gClient;

    function __construct(){

        $this->gClient = new \Google_Client();

        $this->gClient->setApplicationName('TSM Client'); // ADD YOUR AUTH2 APPLICATION NAME (WHEN YOUR GENERATE SECRATE KEY)
        $this->gClient->setClientId('665242793026-cmskapaiveadved5rqgfab5f8rk4p52d.apps.googleusercontent.com');
        $this->gClient->setClientSecret('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');
        $this->gClient->setRedirectUri(route('google.login'));
        $this->gClient->setDeveloperKey('AIzaSyDn3Eico4TT6VxK3KrN8m_mJSKUn3VXr3k');
        $this->gClient->setScopes(array(
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/drive'
        ));

        $this->gClient->setAccessType("offline");

        $this->gClient->setApprovalPrompt("force");
    }

    public function googleLogin(Request $request)  {

        $google_oauthV2 = new Oauth2($this->gClient);


        if ($request->get('code')){

            $this->gClient->authenticate($request->get('code'));

            $request->session()->put('token', $this->gClient->getAccessToken());
        }

        if ($request->session()->get('token')){

            $this->gClient->setAccessToken($request->session()->get('token'));
        }

        if ($this->gClient->getAccessToken()){

            //FOR LOGGED IN USER, GET DETAILS FROM GOOGLE USING ACCES
            $user = User::find(1);

            $user->access_token = json_encode($request->session()->get('token'));

            $user->save();

            dd("Successfully authenticated");

        } else{

            // FOR GUEST USER, GET GOOGLE LOGIN URL
            $authUrl = $this->gClient->createAuthUrl();

            return redirect()->to($authUrl);
        }
    }

    public function googleDriveFileUpload()
    {
        $service = new Drive($this->gClient);

        $user = User::find(1);
        $this->gClient->setAccessToken(json_decode($user->access_token, true));

        if ($this->gClient->isAccessTokenExpired()) {
            // Refresh token logic...
        }

        // Check if the folder "TSM" exists
        $folderName = 'TSM';
        $folderId = $this->getFolderId($service, $folderName);

        if (!$folderId) {
            // If the folder doesn't exist, create it
            $folderId = $this->createFolder($service, $folderName);
        }

        // Upload file to the folder
        $file = new DriveFile([
            'name' => 'video.mp4',
            'parents' => [$folderId]
        ]);

        $result = $service->files->create($file, array(
            'data' => file_get_contents(public_path('PROMO_1699922340.mp4')),
            'mimeType' => 'application/octet-stream',
            'uploadType' => 'media'
        ));

        $url = 'https://drive.google.com/open?id=' . $result->id;
        dd($result);
    }

    private function getFolderId($service, $folderName)
    {
        // Check if the folder "Webappfix" already exists
        $params = [
            'q' => "mimeType='application/vnd.google-apps.folder' and name='{$folderName}'",
            'spaces' => 'drive'
        ];

        $folders = $service->files->listFiles($params);

        if (count($folders->getFiles()) > 0) {
            // Folder exists, return its ID
            return $folders->getFiles()[0]->id;
        }

        // Folder doesn't exist
        return null;
    }

    private function createFolder($service, $folderName)
    {
        // Create the folder "TSM"
        $fileMetadata = new Drive\DriveFile(array(
            'name' => $folderName,
            'mimeType' => 'application/vnd.google-apps.folder'
        ));

        $folder = $service->files->create($fileMetadata, array('fields' => 'id'));

        printf("Folder ID: %s\n", $folder->id);

        return $folder->id;
    }

}
