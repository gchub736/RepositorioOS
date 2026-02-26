<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuarios';

    protected $fillable = [
        'nome',
        'cpf',
        'senha',
        'cargo',
    ];

    protected $hidden = [
        'senha',
        'remember_token',
    ];

    // Avisa ao Laravel que a coluna de senha se chama 'senha'
    public function getAuthPassword()
    {
        return $this->senha;
    }

    protected function casts(): array
    {
        return [
            'senha' => 'hashed',
        ];
    }
}