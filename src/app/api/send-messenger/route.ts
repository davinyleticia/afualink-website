import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

// Defina sua SECRET_KEY no .env.local (deve ser a mesma do Flask)
const JWT_SECRET = process.env.JWT_SECRET || 'sua_secret_key_aqui';

export async function POST(request: Request) {
  try {
    // --- 1. VALIDAÇÃO DE AUTORIZAÇÃO FORTE (JWT) ---
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    try {
      // Verifica se o token é válido e não expirou
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 401 });
    }

    // --- 2. VALIDAÇÃO DE DADOS (SCHEMA) ---
    const body = await request.json();
    const { recipients, subject, message, signature, canReply } = body;

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: 'Lista de destinatários inválida' }, { status: 400 });
    }

    if (!subject || !message) {
      return NextResponse.json({ error: 'Assunto e mensagem são obrigatórios' }, { status: 400 });
    }

    // Validação básica de formato de e-mail (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = recipients.filter(email => !emailRegex.test(email));
    
    if (invalidEmails.length > 0) {
      return NextResponse.json({ 
        error: `E-mails inválidos detectados: ${invalidEmails.join(', ')}` 
      }, { status: 400 });
    }

    // --- 3. CONFIGURAÇÃO DO TRANSPORTE ---
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: Number(process.env.EMAIL_PORT) === 465, // true para 465, false para 587
      auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
      },
    });

    // --- 4. CONFIGURAÇÃO DO ENVIO ---
    const mailOptions = {
      from: `"Afulink Suporte" <${process.env.EMAIL_USER}>`,
      to: recipients.join(','), // Envio em lote (CC/BCC seria melhor para privacidade)
      subject: `[Afulink] ${subject}`,
      replyTo: canReply ? process.env.EMAIL_USER : 'noreply@afulink.com.br',
      html: `
        <div style="font-family: Arial, sans-serif; color: #003366; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #f37021; text-transform: uppercase;">${subject}</h2>
          <div style="font-size: 16px; line-height: 1.5; color: #333;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <br>
          <div style="border-top: 2px solid #f37021; padding-top: 15px; margin-top: 20px;">
            <p style="margin: 0; font-weight: bold; color: #003366;">${signature}</p>
            <p style="margin: 0; font-size: 12px; color: #666;">Afulink Treinamentos Profissionais</p>
          </div>
        </div>
      `,
    };

    // --- 5. EXECUÇÃO ---
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, count: recipients.length });

  } catch (error: any) {
    console.error("Erro crítico na API de E-mail:", error);
    return NextResponse.json({ 
      error: 'Erro interno ao processar envio', 
      details: error.message 
    }, { status: 500 });
  }
}