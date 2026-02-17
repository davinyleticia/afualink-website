import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  // 1. Validação simples de segurança (Exemplo: checar Header de Autorização)
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const { recipients, subject, message, signature, canReply } = await request.json();

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: `"Afulink" <${process.env.EMAIL_USER}>`,
      to: recipients.join(','),
      subject: subject,
      replyTo: canReply ? process.env.EMAIL_USER : 'noreply@afulink.com.br',
      html: `
        <div style="font-family: sans-serif; color: #003366;">
          ${message}
          <br><br>
          <div style="border-top: 1px solid #ccc; padding-top: 10px; color: #f37021; font-weight: bold;">
            ${signature}
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Falha no envio' }, { status: 500 });
  }
}