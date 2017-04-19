<?php

namespace App\Http\Controllers;

use App\Token;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Log;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\Signer\Keychain;
use Lcobucci\JWT\Signer\Rsa\Sha256;
use Lcobucci\JWT\ValidationData;

class TokenController extends Controller
{
    public function getValidate(Request $request)
    {
        $jResponse = [
            'success' => false,
            'message' => null
        ];

        try {
            $token = $request->get('token');
            $token = (new Parser())->parse((string)$token);

            $signer = new Sha256();
            $keyChain = new Keychain();
            $validator = new ValidationData();

            $validator->setIssuer(env('JWT_ISSUER'));

            $isValid = $token->verify($signer, $keyChain->getPublicKey(file_get_contents(storage_path('/app/public'))));

            if ($isValid) {
                $id = $token->getClaim('uid');
                $oToken = Token::find($id);

                if ($oToken) {
                    $jResponse['success'] = true;
                }

            } else {
                $jResponse['message'] = 'Token incorrecto.';
            }
        } catch (\Exception $ex) {
            Log::error($ex->getMessage());
            Log::error($ex->getTraceAsString());

            $jResponse['message'] = 'Formato incorrecto.';
        }

        return response()->json($jResponse);
    }

    public function getLogout(Request $request)
    {
        try {
            $token = $request->get('token');
            $token = (new Parser())->parse((string)$token);
            $signer = new Sha256();
            $validator = new ValidationData();
            $validator->setIssuer(env('JWT_ISSUER'));

            $isValid = ($token->validate($validator)) ? $token->verify($signer, env('JWT_KEY')) : false;

            if ($isValid) {
                $id = $token->getClaim('uid');
                Token::truncate($id);
            }
        } catch (\Exception $ex) {
            Log::error($ex->getMessage());
            Log::error($ex->getTraceAsString());
        }
    }
}
