<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\ValidationData;

class TokenController extends Controller
{
    public function getValidate($token)
    {
        $jResponse = [
            'success' => false,
            'message' => null
        ];

        $token = (new Parser())->parse((string)$token);
        $signer = new Sha256();
        $validator = new ValidationData();
        $validator->setIssuer(env('JWT_ISSUER'));

        $isValid = ($token->validate($validator)) ? $token->verify($signer, env('JWT_KEY')) : false;

        if ($isValid) {
            $jResponse['success'] = true;
        } else {
            $jResponse['message'] = 'Token incorrecto.';
        }

        return response()->json($jResponse);
    }
}
