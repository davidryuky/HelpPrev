import React from 'react';
import { Lock } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-8">
          <div className="bg-slate-100 p-3 rounded-full">
            <Lock className="w-6 h-6 text-slate-900" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Política de Privacidade</h1>
        </div>

        <div className="prose prose-slate max-w-none text-slate-600">
          <p className="text-lg font-medium text-slate-900 mb-6">
            Sua privacidade é nossa prioridade absoluta. Na HelpPrev, tratamos seus dados com o mesmo cuidado que tratamos seu processo: com sigilo total.
          </p>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Coleta de Dados</h3>
          <p className="mb-4">
            Coletamos apenas as informações estritamente necessárias para realizar a análise inicial do seu caso previdenciário, tais como: Nome, Telefone (WhatsApp) e tipo de benefício desejado. Esses dados são fornecidos voluntariamente por você através de nossos formulários.
          </p>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Uso das Informações</h3>
          <p className="mb-4">
            Utilizamos seus dados exclusivamente para:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Entrar em contato via WhatsApp ou telefone para entender sua situação jurídica.</li>
            <li>Realizar a triagem inicial de viabilidade do seu direito.</li>
            <li>Agendar consultas com nossos advogados especialistas.</li>
          </ul>
          <p className="mb-4 font-bold">
            Jamais vendemos, alugamos ou compartilhamos seus dados com terceiros para fins de marketing.
          </p>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Sigilo Advocatício</h3>
          <p className="mb-4">
            Todas as informações compartilhadas com a HelpPrev estão protegidas pelo Sigilo Profissional (Código de Ética da OAB). Isso significa que tudo o que você nos conta é confidencial e protegido por lei.
          </p>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Segurança Digital</h3>
          <p className="mb-4">
            Adotamos medidas técnicas robustas para proteger seus dados, incluindo criptografia em nosso banco de dados e protocolos seguros de comunicação (HTTPS).
          </p>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Seus Direitos (LGPD)</h3>
          <p className="mb-4">
            Conforme a Lei Geral de Proteção de Dados, você tem o direito de:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Solicitar quais dados temos sobre você.</li>
            <li>Pedir a correção de dados incompletos.</li>
            <li>Solicitar a exclusão dos seus dados de nossa base a qualquer momento.</li>
          </ul>

          <div className="bg-slate-50 p-6 rounded-xl mt-8">
            <h4 className="font-bold text-slate-900 mb-2">Dúvidas?</h4>
            <p className="text-sm">
              Para exercer seus direitos ou tirar dúvidas sobre nossa política, entre em contato pelo e-mail: <br/>
              <span className="text-amber-600 font-medium">privacidade@helpprev.com.br</span>
            </p>
          </div>
          
          <p className="text-xs text-slate-400 mt-8">
            Última atualização: Dezembro de 2024.
          </p>
        </div>
      </div>
    </div>
  );
};
