<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSupplyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'supplier_id' => 'required|numeric|exists:App\Models\Supplier,id',
            'tube_count' => 'required|numeric|not_in:0',
            'note' => 'nullable|string'
        ];
    }

    public function messages() {
        return [
            'supplier_id.required' => 'Silakan pilih supplier terlebih dahulu.',
            'tube_count' => 'Silakan pilih setidaknya satu produk.'
        ];
    }
}