<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGasRequest extends FormRequest
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
        // return [
            
        // ];
        
        return [
            'name' => 'required|string|max:255',
            // 'capital_price' => 'required|numeric',
            'selling_price' => 'required|numeric',
            'total_sales' => 'required|numeric'
        ];
    }
}