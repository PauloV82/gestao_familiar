<?php

namespace App\Http\Controllers;

use App\Models\Despesa;
use App\Models\User;
use Illuminate\Http\Request;

class DespesasController extends Controller
{
    
   
    


     //
    //
    // Categoria
    //
    //
    
    public function categoria($userId)
    {
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        }

        $despesas = Despesa::where('user_id', $userId)
            ->select('categoria', \DB::raw('SUM(gasto) as total_gasto'))
            ->whereNotNull('categoria')
            ->groupBy('categoria')
            ->havingRaw('SUM(gasto) > 0') 
            ->get();
        return response()->json($despesas);
    }


    public function showCategoria($userId)
{
    // Verifica se o usuário existe
    $user = User::find($userId);

    if (!$user) {
        return response()->json(['message' => 'Usuário não encontrado'], 404);
    }

    // Busca as categorias dos registros onde descricao é 'Categoria'
    $despesas = Despesa::where('user_id', $userId)
        ->where('descricao', 'Categoria') // Filtra pela descrição igual a 'Categoria'
        ->select('categoria') // Seleciona apenas o campo 'categoria'
        ->whereNotNull('categoria') // Garante que a categoria não seja nula
        ->groupBy('categoria') // Agrupa por categoria
        ->get();

    // Retorna o resultado em formato JSON
    return response()->json($despesas);
}


 







    public function chart1($userId){
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        }

        // Consulta as despesas do usuário, agrupadas por mês, somando receita e gasto
        $dadosPorMes = Despesa::where('user_id', $userId)
    ->selectRaw('strftime("%m", data) as mes, strftime("%Y", data) as ano, 
                SUM(receita) as total_receita, SUM(gasto) as total_gasto')
    ->groupBy('ano', 'mes')
    ->orderBy('ano', 'desc')
    ->orderBy('mes', )
    ->get();

    

        // Retorna os dados no formato JSON, com os números dos meses
        return response()->json($dadosPorMes);
    }
  









        public function receita($userId)
    {
        $somaReceitas = Despesa::where('user_id', $userId)->sum('receita');

        // Soma dos gastos
        $somaGastos = Despesa::where('user_id', $userId)->sum('gasto');

        // Calcular o saldo (receita - gasto)
        $saldo = $somaReceitas - $somaGastos;

        // Formatar os valores com duas casas decimais
        $somaReceitasFormatada = number_format($somaReceitas, 2, '.', '');
        $somaGastosFormatada = number_format($somaGastos, 2, '.', '');
        $saldoFormatado = number_format($saldo, 2, '.', '');

        // Retornar o saldo, receita e gasto
        return response()->json([
            'soma_receita' => $somaReceitasFormatada,
            'soma_gasto' => $somaGastosFormatada,
            'saldo' => $saldoFormatado
        ]);
    }







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
        // Verifica se o usuário existe
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        }
    
        // Validação personalizada
        $request->validate([
            'descricao' => 'required|string|max:255',
            'gasto' => 'nullable|numeric|min:0',
            'receita' => 'nullable|numeric|min:0',
            'data' => 'required|date',
        ]);
    
        // Verifica se ao menos um valor (gasto ou receita) foi fornecido
        if (!$request->has('gasto') && !$request->has('receita')) {
            return response()->json(['message' => 'É necessário informar um gasto ou uma receita.'], 422);
        }
    
        // Verifica o limite atual do usuário, somando o gasto de todas as despesas
       
    
        // Condicionalmente calcula ou verifica o limite
        $limite = $request->input('limite', 0);
    
       
        // Cria o registro de despesa
        $despesa = new Despesa();
        $despesa->user_id = $userId;
        $despesa->descricao = $request->input('descricao');
        $despesa->gasto = $request->input('gasto', 0);
        $despesa->receita = $request->input('receita', 0);
        $despesa->data = $request->input('data');
        $despesa->categoria = $request->input('categoria');
        $despesa->limite = $limite; 
        $despesa->save();
    
        return response()->json([
            'message' => 'Despesa criada com sucesso!',
            'data' => $despesa,
        ], 201);
    }






    public function limite($userId)
{
    // Verifica se o usuário existe
    $user = User::find($userId);
    if (!$user) {
        return response()->json(['message' => 'Usuário não encontrado'], 404);
    }

    // Calcular total de despesas (somando todos os gastos)
    $totalDespesas = Despesa::where('user_id', $userId)->sum('gasto');

    // Buscar todos os limites já registrados para o usuário
    $totalLimites = Despesa::where('user_id', $userId)
    ->where('descricao', 'Limite') // Filtra pelas despesas que têm a descrição 'Limite'
    ->sum('limite');// Soma o valor dos limites

    // Retorna a soma dos gastos e a soma dos limites
    return response()->json([
        'total_gastos' => $totalDespesas,   // Soma total dos gastos
        'total_limites' => $totalLimites,   // Soma total dos limites
        'message' => 'Soma dos gastos e limites calculada com sucesso!',
    ]);
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
            'gasto' => 'required|numeric',
            'receita' => 'required|numeric',
            'limite' => 'required|numeric',
            'data' => 'nullable|date',
            'categoria' => 'nullable|string|max:255',
        ]);

       
        if ($request->has('descricao')) {
            $despesa->descricao = $request->input('descricao');
        }
        
        if ($request->has('gasto')) {
            $despesa->gasto = $request->input('gasto');
        }
        if ($request->has('receita')) {
            $despesa->receita = $request->input('receita');
        }
        if ($request->has('limite')) {
            $despesa->limite = $request->input('limite');
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
