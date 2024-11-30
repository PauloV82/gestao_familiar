<?php

namespace App\Http\Controllers;

use App\Models\Despesa;
use App\Models\User;
use Illuminate\Http\Request;

class DespesasController extends Controller
{
    public function index($userId)
    {
        
        $user = User::find($userId);
    
        if (!$user) {
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        }
    
       
        $despesas = Despesa::where('user_id', $userId)->get();
    
        return response()->json($despesas);
    }
    

    public function store(Request $request, $userId)
{
    $user = User::find($userId);
    if (!$user) {
        return response()->json(['message' => 'Usuário não encontrado'], 404);
    }

    $request->validate([
        'descricao' => 'required|string|max:255',
        'value' => 'required|numeric',
        'data' => 'required|date',
  
        'categoria' => 'nullable|string|max:255',
    ]);

    $despesa = new Despesa();
    $despesa->user_id = $userId;
    $despesa->descricao = $request->input('descricao');
    $despesa->value = $request->input('value');
    $despesa->data = $request->input('data');
    $despesa->categoria = $request->input('categoria');
    $despesa->save();

    return response()->json([
        'message' => 'Despesa criada com sucesso!',
        'data' => $despesa,
        'location' => route('despesas.show', ['userId' => $userId, 'despesa' => $despesa->id])
    ], 201);
}


    
    public function show($userId, $id){

    $despesa = Despesa::where('user_id', $userId)->find($id);

    if (!$despesa) {
        return response()->json(['message' => 'Despesa não encontrada'], 404);
    }

    return response()->json($despesa);
}


        public function update(Request $request, $userId, $id)
{
    // Encontrar a despesa pelo ID e verificar se ela existe
    $despesa = Despesa::where('user_id', $userId)->find($id);

    if (!$despesa) {
        return response()->json(['message' => 'Despesa não encontrada'], 404);
    }

        
        $request->validate([
            'descricao' => 'nullable|string|max:255',
            'value' => 'nullable|numeric',
            'data' => 'nullable|date',
            'categoria' => 'nullable|string|max:255',
        ]);

       
        if ($request->has('descricao')) {
            $despesa->descricao = $request->input('descricao');
        }
        
        if ($request->has('value')) {
            $despesa->value = $request->input('value');
        }

        if ($request->has('data')) {
            $despesa->data = $request->input('data');
        }

        if ($request->has('categoria')) {
            $despesa->categoria = $request->input('categoria');
        }

        // Salva as alterações
        $despesa->save();

        return response()->json($despesa);
    }

    
    public function destroy($userId, $id)
{
   
    $user = User::find($userId);
    if (!$user) {
        return response()->json(['message' => 'Usuário não encontrado'], 404);
    }

    
    $despesa = Despesa::where('user_id', $userId)->where('id', $id)->first();
    if (!$despesa) {
        return response()->json(['message' => 'Despesa não encontrada'], 404);
    }


    $despesa->delete();

    return response()->noContent();
}

}
