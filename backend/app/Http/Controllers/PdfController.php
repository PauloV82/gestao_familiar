<?php
// app/Http/Controllers/PdfController.php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Despesa;
use TCPDF;
use Illuminate\Http\Request; // Importando o Request para pegar os dados do corpo da requisição

class PdfController extends Controller
{
    // Função que retorna as despesas por categoria e gera o PDF
    public function generateTablePdf($userId)
{
    // Chama a função categoria para pegar as despesas do usuário
    $despesas = $this->categoria($userId);

    // Se não houver despesas, retorna uma mensagem
    if ($despesas->isEmpty()) {
        return response()->json(['message' => 'Não há despesas para este usuário.'], 404);
    }

    // Criando o PDF
    $pdf = new TCPDF();
    $pdf->AddPage();
    $pdf->SetFont('helvetica', '', 12);

    // Título
    $pdf->SetFont('helvetica', 'B', 14);
    $pdf->Cell(0, 10, 'Relatório de Despesas por Categoria', 0, 1, 'C');

    // Adicionando a tabela
    $pdf->Ln(10); // Quebra de linha
    $pdf->SetFont('helvetica', 'B', 12);

    // Cabeçalho da tabela
    $pdf->Cell(80, 10, 'Categoria', 1, 0, 'C', 1);
    $pdf->Cell(50, 10, 'Valor percentual', 1, 0, 'C', 1);
    $pdf->Cell(60, 10, 'Valor real', 1, 1, 'C', 1);

    // Total gasto geral
    $totalGasto = $despesas->sum('total_gasto');

    // Conteúdo da tabela
    $pdf->SetFont('helvetica', '', 12);
    foreach ($despesas as $row) {
        $percentual = ($row->total_gasto / $totalGasto) * 100;
        $pdf->Cell(80, 10, $row->categoria, 1, 0, 'C');
        $pdf->Cell(50, 10, number_format($percentual, 2) . '%', 1, 0, 'C');
        $pdf->Cell(60, 10, number_format($row->total_gasto, 2, ',', '.'), 1, 1, 'C');
    }

    // Definir os cabeçalhos para forçar o download
    return response($pdf->Output('relatorio_despesas.pdf', 'S'))
        ->header('Content-Type', 'application/pdf')
        ->header('Content-Disposition', 'attachment; filename="relatorio_despesas.pdf"');
}



    // Função que retorna as despesas por categoria (reutilizada do seu controlador original)
    public function categoria($userId)
    {
        // Verifica se o usuário existe
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        }

        // Busca as despesas do usuário, agrupa por categoria e filtra as válidas
        $despesas = Despesa::where('user_id', $userId)
            ->select('categoria', \DB::raw('SUM(gasto) as total_gasto'))
            ->whereNotNull('categoria')
            ->groupBy('categoria')
            ->havingRaw('SUM(gasto) > 0') // Aqui aplicamos a filtragem no SQL
            ->get();

        // Retorna o resultado em formato de coleção
        return $despesas;
    }
}
