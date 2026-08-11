import type { ReactNode } from 'react'
import { tw } from '@/utils/tailwind'

export type TAboutFlowSide = 'cliente' | 'servidor'

export interface IAboutFlowStep {
  side: TAboutFlowSide
  title: string
  detail: ReactNode
  prevents?: ReactNode
}

export interface IAboutFlowPhase {
  title: string
  steps: IAboutFlowStep[]
}

const SIDES: Record<TAboutFlowSide, { label: string; badge: string; chip: string }> = {
  cliente: {
    label: 'Cliente',
    badge: 'bg-gray-800 text-white',
    chip: 'bg-gray-100 text-gray-700'
  },
  servidor: {
    label: 'Servidor',
    badge: 'bg-primary-600 text-white',
    chip: 'bg-primary-50 text-primary-700'
  }
}

const Code = ({ children }: { children: ReactNode }) => (
  <code className='text-[13px]'>{children}</code>
)

const PHASES: IAboutFlowPhase[] = [
  {
    title: 'O pedido sai',
    steps: [
      {
        side: 'cliente',
        title: 'Formulário envia email e senha',
        detail: (
          <>
            <Code>POST /auth/login</Code> com <Code>credentials: &apos;include&apos;</Code>. O
            cliente não gera, não guarda e não lê nenhum token em momento algum.
          </>
        ),
        prevents:
          'XSS não tem credencial para roubar, porque não existe nada em storage nem em memória.'
      },
      {
        side: 'servidor',
        title: 'CORS decide se a origem pode falar',
        detail: (
          <>
            A origem é conferida contra uma allowlist explícita, com <Code>credentials: true</Code>{' '}
            e <Code>X-CSRF-Token</Code> entre os headers permitidos.
          </>
        ),
        prevents:
          'Refletir a origem do chamador com credenciais ligadas entregaria a conta. A lista fixa impede que outro site leia a resposta.'
      }
    ]
  },
  {
    title: 'O servidor verifica',
    steps: [
      {
        side: 'servidor',
        title: 'ValidationPipe valida o corpo',
        detail: (
          <>
            DTO com <Code>class-validator</Code>, pipe global com <Code>whitelist</Code> e{' '}
            <Code>forbidNonWhitelisted</Code>.
          </>
        ),
        prevents: 'Propriedade não modelada vira 400 antes de tocar no banco.'
      },
      {
        side: 'servidor',
        title: 'Rate limit por IP e por conta',
        detail: (
          <>
            Limite global mais um limite estrito em <Code>/auth/login</Code>, somado a um contador
            de falhas por email.
          </>
        ),
        prevents:
          'Força bruta e credential stuffing. Limite por IP sozinho não segura ataque distribuído, daí o contador por conta.'
      },
      {
        side: 'servidor',
        title: 'Procura o usuário com custo constante',
        detail:
          'Se o email não existe, a senha é comparada com um hash bcrypt real de mentira, no mesmo cost factor do sistema.',
        prevents:
          'Oráculo de tempo: uma resposta rápida denunciaria que aquele email não está cadastrado.'
      },
      {
        side: 'servidor',
        title: 'bcrypt.compare decide',
        detail:
          'Senha errada e email inexistente terminam no mesmo 401, com a mesma mensagem e o mesmo tempo de resposta.',
        prevents: 'Enumeração de usuários pela diferença entre as respostas.'
      }
    ]
  },
  {
    title: 'O servidor emite',
    steps: [
      {
        side: 'servidor',
        title: 'Assina os dois tokens',
        detail: (
          <>
            Access de 15 minutos com <Code>aud: access</Code>, refresh de 14 dias com{' '}
            <Code>aud: refresh</Code> e <Code>jti</Code> igual ao id da linha criada em{' '}
            <Code>RefreshToken</Code>. Segredos separados por tipo, <Code>HS256</Code> fixado,{' '}
            <Code>iss</Code> e <Code>aud</Code> verificados na volta.
          </>
        ),
        prevents:
          'Confusão de tipo, que transformaria um refresh de 14 dias em access, e troca de algoritmo na verificação.'
      },
      {
        side: 'servidor',
        title: 'Deriva o csrf_token',
        detail: (
          <>
            O valor não é aleatório: é um HMAC sobre o <Code>jti</Code> da sessão, com um segredo
            que só o servidor tem.
          </>
        ),
        prevents:
          'Um subdomínio irmão consegue sobrescrever o cookie de CSRF, mas não consegue produzir um par válido sem conhecer o jti.'
      }
    ]
  },
  {
    title: 'A resposta volta',
    steps: [
      {
        side: 'servidor',
        title: 'Controller escreve três Set-Cookie',
        detail: (
          <>
            <Code>access_token</Code> HttpOnly em <Code>Path=/</Code>, <Code>refresh_token</Code>{' '}
            HttpOnly em <Code>Path=/auth</Code>, e <Code>csrf_token</Code> legível por JS em{' '}
            <Code>Path=/</Code>. Todos com <Code>Secure</Code>, <Code>SameSite=Lax</Code> e{' '}
            <Code>Domain</Code> vazio.
          </>
        ),
        prevents:
          'HttpOnly tira os tokens do alcance do JavaScript, SameSite=Lax corta o POST cross-site, e Path=/auth mantém a credencial de 14 dias fora do tráfego comum.'
      },
      {
        side: 'servidor',
        title: 'Responde só com o usuário',
        detail: (
          <>
            O corpo é <Code>{'{ user: { id, name, email } }'}</Code>. Nenhum token aparece em corpo,
            URL, log ou mensagem de erro.
          </>
        ),
        prevents:
          'Vazamento por log de servidor, histórico do navegador e cópia acidental para storage.'
      },
      {
        side: 'cliente',
        title: 'Navegador guarda os cookies',
        detail:
          'O app não enxerga o Set-Cookie e não recebe token nenhum. A sessão passa a existir sem que exista qualquer valor em JavaScript.',
        prevents: 'Não há o que um script injetado exfiltrar.'
      }
    ]
  },
  {
    title: 'Toda requisição seguinte',
    steps: [
      {
        side: 'cliente',
        title: 'Cookie vai sozinho, header vai na mão',
        detail: (
          <>
            Basta <Code>credentials: &apos;include&apos;</Code> para o cookie ir. Em mutação, o app
            lê <Code>csrf_token</Code> na hora do envio e copia para <Code>X-CSRF-Token</Code>.
          </>
        ),
        prevents:
          'Outro site consegue fazer o navegador disparar a requisição, mas não consegue ler o cookie para montar o header.'
      },
      {
        side: 'servidor',
        title: 'Guards conferem tudo de novo',
        detail: (
          <>
            <Code>AuthGuard</Code> lê <Code>request.cookies.access_token</Code>, sem alternativa por{' '}
            <Code>Authorization</Code>. O guard de CSRF compara cookie e header com{' '}
            <Code>timingSafeEqual</Code> e confere <Code>Origin</Code> contra a allowlist.
          </>
        ),
        prevents:
          'CSRF vindo de subdomínio irmão, e erros detalhados que ajudariam a calibrar a próxima tentativa: a recusa é sempre um 401 ou 403 seco.'
      },
      {
        side: 'cliente',
        title: 'Sessão é uma pergunta, não um estado',
        detail: (
          <>
            Estar logado quer dizer <Code>GET /auth/me</Code> respondendo 200. Não existe token para
            o cliente inspecionar.
          </>
        ),
        prevents:
          'Confiar num flag local que o próprio usuário edita. Quem decide continua sendo o servidor, a cada requisição.'
      }
    ]
  }
]

let counter = 0

const NUMBERED = PHASES.map((phase) => ({
  ...phase,
  steps: phase.steps.map((step) => {
    counter += 1

    return { ...step, number: counter }
  })
}))

export const AboutFlow = () => (
  <div className='flex flex-col gap-y-[24px]'>
    <div className='flex flex-wrap items-center gap-[8px]'>
      {(['cliente', 'servidor'] as TAboutFlowSide[]).map((side) => (
        <span
          key={side}
          className={tw(
            'rounded-[4px] px-[8px] py-[4px] text-[12px] font-[600] tracking-[0.04em] uppercase',
            SIDES[side].chip
          )}
        >
          {SIDES[side].label}
        </span>
      ))}
    </div>

    {NUMBERED.map((phase) => (
      <div key={phase.title} className='flex flex-col gap-y-[12px]'>
        <p className='text-[13px] text-gray-600 font-[600] tracking-[0.06em] uppercase'>
          {phase.title}
        </p>

        <div className='flex flex-col'>
          {phase.steps.map((step, index) => {
            const side = SIDES[step.side]
            const isLast = index === phase.steps.length - 1

            return (
              <div key={step.title} className='flex gap-x-[12px]'>
                <div className='flex flex-col items-center'>
                  <span
                    className={tw(
                      'shrink-0 w-[28px] h-[28px] flex items-center justify-center rounded-full text-[13px] font-[600]',
                      side.badge
                    )}
                  >
                    {step.number}
                  </span>

                  {!isLast && <span className='w-[2px] flex-1 bg-gray-200' />}
                </div>

                <div className={tw('flex flex-col gap-y-[6px]', !isLast && 'pb-[16px]')}>
                  <div className='flex flex-wrap items-center gap-[8px]'>
                    <span
                      className={tw(
                        'rounded-[4px] px-[6px] py-[2px] text-[11px] font-[600] tracking-[0.04em] uppercase',
                        side.chip
                      )}
                    >
                      {side.label}
                    </span>

                    <span className='text-[16px] text-black font-[600]'>{step.title}</span>
                  </div>

                  <p className='text-[15px] text-gray-700 leading-[1.6]'>{step.detail}</p>

                  {step.prevents && (
                    <p className='rounded-[6px] border-l-[2px] border-primary-300 bg-primary-50 px-[10px] py-[8px] text-[14px] text-primary-800 leading-[1.5]'>
                      <strong>Previne:</strong> {step.prevents}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    ))}
  </div>
)
