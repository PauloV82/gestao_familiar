<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
        ]);

        $user = new User();
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->password = bcrypt($request->input('password'));
        $user->save();

        return response()->json([
            'location' => route('users.show', $user->id)
        ], 201);
    }

    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        }

        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $name = $request->input('name');
            if ($name) {
                $user->name = $name;
            }

            $email = $request->input('email');
            if ($email) {
                $user->email = $email;
            }

            $password = $request->input('password');
            if ($password) {
                $user->password = bcrypt($password);
            }

            $user->save();

            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao atualizar o usuário: ' . $e->getMessage()], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

            return response()->noContent();
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao deletar o usuário: ' . $e->getMessage()], 409);
        }
    }
}
