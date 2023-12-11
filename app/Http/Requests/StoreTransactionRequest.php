<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
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
            'customer_id' => 'required|numeric|exists:App\Models\Customer,id',
            'total_price' => 'required|numeric',
            'is_tube_returned' => 'required|boolean',
            'is_debt' => 'required|boolean',
            'note' => 'nullable|string',
        ];
    }
    public function messages() {
        return [
            'customer_id.required' => 'Silakan pilih pelanggan terlebih dahulu.',
            'total_price' => 'Silakan pilih setidaknya satu produk.'
        ];
    }
}