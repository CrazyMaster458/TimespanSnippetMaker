<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Google\Service\Oauth2;
use Google\Service\Drive;
use Google\Service\Drive\DriveFile;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Google\Client as GoogleClient;

class GoogleDriveController extends Controller
{
    public $gClient;

    public $googleClient;


    // function __construct(){

    //     $this->gClient = new \Google_Client();

    //     $this->gClient->setApplicationName('TSM Client'); // ADD YOUR AUTH2 APPLICATION NAME (WHEN YOUR GENERATE SECRATE KEY)
    //     $this->gClient->setClientId('665242793026-cmskapaiveadved5rqgfab5f8rk4p52d.apps.googleusercontent.com');
    //     $this->gClient->setClientSecret('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');
    //     $this->gClient->setRedirectUri(route('google.login'));
    //     $this->gClient->setDeveloperKey('AIzaSyDn3Eico4TT6VxK3KrN8m_mJSKUn3VXr3k');
    //     $this->gClient->setScopes(array(
    //         'https://www.googleapis.com/auth/drive.file',
    //         'https://www.googleapis.com/auth/drive'
    //     ));

    //     $this->gClient->setAccessType("offline");

    //     $this->gClient->setApprovalPrompt("force");
    // }

    function __construct(){

        $this->googleClient = new GoogleClient();

        $this->googleClient->setApplicationName('TSM Client');
        $this->googleClient->setClientId('665242793026-cmskapaiveadved5rqgfab5f8rk4p52d.apps.googleusercontent.com');
        $this->googleClient->setClientSecret('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');
        $this->googleClient->setRedirectUri('http://127.0.0.1:8000/google/login');
        $this->googleClient->setScopes('https://www.googleapis.com/auth/drive');
        $this->googleClient->setApprovalPrompt('force');

        // Create an instance of the Google OAuth2 service

        // Get the user's access token from the database

        // Set the user's access token in the Google client

        // $this->gClient->setApplicationName('TSM Client'); // ADD YOUR AUTH2 APPLICATION NAME (WHEN YOUR GENERATE SECRATE KEY)
        // $this->gClient->setClientId('665242793026-cmskapaiveadved5rqgfab5f8rk4p52d.apps.googleusercontent.com');
        // $this->gClient->setClientSecret('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');
        // $this->gClient->setRedirectUri(route('google.login'));
        // $this->gClient->setDeveloperKey('AIzaSyDn3Eico4TT6VxK3KrN8m_mJSKUn3VXr3k');
        // $this->gClient->setScopes(array(
        //     'https://www.googleapis.com/auth/drive.file',
        //     'https://www.googleapis.com/auth/drive'
        // ));

        // $this->gClient->setAccessType("offline");

        // $this->gClient->setApprovalPrompt("force");
    }

    public function textlogin($accessToken = "ya29.a0AfB_byADK47ERVAOVFauVstkbpc6A5FggQzztuBAMXN…5QaCgYKAYESARESFQHGX2MikI_OEVaIQjlXgHHsnsSIeA0169")
    {
        $oauth2Service = new Oauth2($this->googleClient);

        $this->googleClient->setAccessToken($accessToken);

        if ($this->googleClient->isAccessTokenExpired()) {
            // If expired, refresh the access token using the refresh token
            $refreshToken = $this->googleClient->getRefreshToken();

            // Set the refresh token in the Google client
            $this->googleClient->refreshToken($refreshToken);

            // Get the new access token
            $newAccessToken = $this->googleClient->getAccessToken();

            dd($newAccessToken);
        }
    }


    // public function redirectToGoogle()
    // {
    //     return Socialite::driver('google')->redirect();
    // }

    // public function handleGoogleCallback(Request $request)
    // {
    //     $socialUser = Socialite::driver('google')->user();

    //     // You can use the user data from $googleUser to create or update your User model

    //     if(Auth::user())
    //     {
    //         $user = User::find(Auth::user()->id);
    //         $user->access_token = $socialUser->token;
    //         $user->save();
    //     }else {
    //         $username = "";

    //         while($username == "" || User::where('username', $username)->exists()) {
    //             $username = 'user'.rand(10000000, 99999999);
    //         }

    //         $user = User::create([
    //             "username"=> $username,
    //             "email"=> $socialUser->email,
    //             "access_token"=> $socialUser->token,
    //         ]);
    //     }

    //     // Now you can proceed with Google Drive operations using the authenticated user
    //     $this->googleDriveFileUpload($user->id);
    // }

    public function googleLogin(Request $request)  {

        $google_oauthV2 = new Oauth2($this->gClient);

        $authUrl = $this->gClient->createAuthUrl([
            'access_type' => 'offline',
            'approval_prompt' => 'force',
        ]);


        if ($request->get('code')){

            $this->gClient->authenticate($request->get('code'));

            $request->session()->put('token', $this->gClient->getAccessToken());
        }

        if ($request->session()->get('token')){

            $this->gClient->setAccessToken($request->session()->get('token'));
        }

        if ($this->gClient->getAccessToken()){

            //FOR LOGGED IN USER, GET DETAILS FROM GOOGLE USING ACCES
            $user = User::find(7);

            $user->access_token = json_encode($request->session()->get('token'));

            $user->save();

            // dd($request->session());

            // dd("Successfully authenticated");

        } else{

            // FOR GUEST USER, GET GOOGLE LOGIN URL
            $authUrl = $this->gClient->createAuthUrl();

            return redirect()->to($authUrl);
        }
    }

    public function googleDriveFileUpload()
    {
        $service = new Drive($this->gClient);

        $user = User::find(7);
        $this->gClient->setAccessToken($user->access_token);

        if ($this->gClient->isAccessTokenExpired()) {
            //Refresh token logic...
        }

        //Check if the folder "TSM" exists
        $folderName = 'TSM';
        $folderId = $this->getFolderId($service, $folderName);

        if (!$folderId) {
            //If the folder doesn't exist, create it
            $folderId = $this->createFolder($service, $folderName);
        }

        //Upload file to the folder
        $file = new DriveFile([
            'name' => 'BURH.mp4',
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

    // public function googleDriveFileUpload(/*string $userId*/)
    // {
    //     $service = new Drive($this->gClient);

    // $user = User::find(/*$userId*/7);
    //     $this->gClient->setAccessToken(json_decode($user->access_token, true));

    //     if ($this->gClient->isAccessTokenExpired()) {
    //         // Refresh token logic...
    //     }

    //     // Check if the folder "TSM" exists
    //     $folderName = 'TSM';
    //     $folderId = $this->getFolderId($service, $folderName);

    //     if (!$folderId) {
    //         // If the folder doesn't exist, create it
    //         $folderId = $this->createFolder($service, $folderName);
    //     }

    //     $file = new DriveFile([
    //         'name' => 'video2131456.mp4',
    //         'parents' => [$folderId]
    //     ]);

    //     $result = $service->files->create($file, array(
    //         'data' => file_get_contents(public_path('1STPUNCH_1694910290.mp4')),
    //         'mimeType' => 'application/octet-stream',
    //         'uploadType' => 'media'
    //     ));

    //     // Upload file to the folder
    //     // $file = new DriveFile([
    //     //     'name' => $request->file('file')->getClientOriginalName(),
    //     //     'parents' => [$folderId]
    //     // ]);

    //     // $result = $service->files->create($file, array(
    //     //     'data' => file_get_contents($request->file('file')->getRealPath()),
    //     //     'mimeType' => 'application/octet-stream',
    //     //     'uploadType' => 'media'
    //     // ));

    //     $url = 'https://drive.google.com/open?id=' . $result->id;
    //     // dd($result);
    // }


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
