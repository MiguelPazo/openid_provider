<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Token;
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
            'jwt' => null
        ];

        $user = $request->get('user');
        $pass = $request->get('pass');

        if ($this->user == $user && $this->pass == $pass) {
            $oToken = Token::create([
                'token' => '--'
            ]);

            $builder = new Builder();
            $signer = new Sha256();
            $token = $builder->setIssuer(url('/') . '/')
                ->setIssuedAt(time())
                ->setExpiration(time() + 3600)
                ->set('uid', $oToken->id)
                ->set('nam', 'Miguel Pazo Sanchez')
                ->sign($signer, env('JWT_KEY'))
                ->getToken();

            $oToken->token = (string)$token;
            $oToken->save();

            $jResponse['success'] = true;
            $jResponse['jwt'] = (string)$token;
        } else {
            $jResponse['message'] = 'Usuario o contraseña incorrectos';
        }

        return response()->json($jResponse);
    }

    public function getFrameSSO()
    {
        return view('frame_sso');
    }

    public function getFrameSLO()
    {
        return view('frame_slo');
    }
}
