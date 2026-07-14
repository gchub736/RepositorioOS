<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de senha</title>
</head>
<body style="margin:0; padding:24px; background-color:#f1f5f9; font-family: Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; margin:0 auto; background-color:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #cbd5e1;">
        <tr>
            <td style="background-color:#1e3a8a; padding:24px;">
                <h1 style="margin:0; color:#ffffff; font-size:18px; letter-spacing:1px; text-transform:uppercase;">
                    Central de Suporte Técnico
                </h1>
            </td>
        </tr>
        <tr>
            <td style="padding:28px;">
                <p style="margin:0 0 16px; color:#1e293b; font-size:15px;">
                    Olá, <strong>{{ $nome }}</strong>.
                </p>
                <p style="margin:0 0 24px; color:#475569; font-size:14px; line-height:1.6;">
                    Recebemos um pedido para redefinir a senha da sua conta.
                    Clique no botão abaixo para criar uma nova senha.
                </p>

                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
                    <tr>
                        <td style="background-color:#1e3a8a; border-radius:8px;">
                            <a href="{{ $resetUrl }}"
                               style="display:inline-block; padding:14px 32px; color:#ffffff; font-size:13px; font-weight:bold; text-decoration:none; text-transform:uppercase; letter-spacing:1px;">
                                Redefinir senha
                            </a>
                        </td>
                    </tr>
                </table>

                <p style="margin:0 0 8px; color:#475569; font-size:13px; line-height:1.6;">
                    Este link expira em <strong>{{ $minutos }} minutos</strong> e só pode ser usado uma vez.
                </p>
                <p style="margin:0 0 24px; color:#475569; font-size:13px; line-height:1.6;">
                    Se você não pediu a troca de senha, ignore este e-mail — sua senha continuará a mesma.
                </p>

                <p style="margin:0; color:#94a3b8; font-size:11px; line-height:1.6; word-break:break-all;">
                    Se o botão não funcionar, copie e cole este endereço no navegador:<br>
                    {{ $resetUrl }}
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
