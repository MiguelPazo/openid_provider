<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Signer\Hmac\Sha256;

class LoginController extends Controller
{
    private $user = 'admin';
    private $pass = '123';

    public function getLogin()
    {
        return view('login');
    }

    public function postLogin(Request $request)
    {
        $jResponse = [
            'success' => false,
            'message' => null,
            'token' => null
        ];

        $user = $request->get('user');
        $pass = $request->get('pass');

        if ($this->user == $user && $this->pass == $pass) {
            $builder = new Builder();
            $signer = new Sha256();
            $token = $builder->setIssuer(url('/') . '/')
                ->setIssuedAt(time())
                ->setExpiration(time() + 3600)
                ->sign($signer, env('JWT_KEY'))
                ->getToken();

            $jResponse['success'] = true;
            $jResponse['token'] = (string)$token;
        } else {
            $jResponse['message'] = 'Usuario o contraseña incorrectos';
        }

        return response()->json($jResponse);
    }

    public function getFrame()
    {
        return view('frame');
    }
}
