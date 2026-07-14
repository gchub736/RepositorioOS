<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\PasswordReset;

/**
 * E-mail com o link de recuperação de senha.
 * Enviado por PasswordResetController@forgotPassword.
 */
class RecuperarSenhaMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $resetUrl,
        public string $nome,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Recuperação de senha - Central de Suporte Técnico',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.recuperar-senha',
            with: [
                'resetUrl' => $this->resetUrl,
                'nome'     => $this->nome,
                'minutos'  => PasswordReset::MINUTOS_VALIDADE,
            ],
        );
    }
}
