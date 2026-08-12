import type { ReactNode } from 'react'
import { tw } from '@/utils/tailwind'

export type TAboutCurrentFlowActor = 'cliente' | 'api' | 'banco'

export interface IAboutCurrentFlowStep {
  title: string
  detail: ReactNode
  actor: TAboutCurrentFlowActor
}

export interface IAboutCurrentFlowRoute {
  path: string
  guard: string
  input: string
  output: string
  method: 'GET' | 'POST'
}

export interface IAboutCurrentFlowSequence {
  title: string
  steps: IAboutCurrentFlowStep[]
}

const ACTORS: Record<TAboutCurrentFlowActor, { label: string; badge: string; chip: string }> = {
  api: {
    label: 'API',
    badge: 'bg-primary-600 text-white',
    chip: 'bg-primary-50 text-primary-700'
  },
  banco: {
    label: 'Banco',
    badge: 'bg-quinary-700 text-white',
    chip: 'bg-quinary-100 text-quinary-800'
  },
  cliente: {
    label: 'Cliente',
    badge: 'bg-gray-800 text-white',
    chip: 'bg-gray-100 text-gray-700'
  }
}

const Code = ({ children }: { children: ReactNode }) => (
  <code className='text-[13px]'>{children}</code>
)

const ROUTES: IAboutCurrentFlowRoute[] = [
  {
    path: '/auth/register',
    guard: '—',
    input: 'name, email, password',
    output: 'accessToken, refreshToken, user',
    method: 'POST'
  },
  {
    path: '/auth/login',
    guard: '—',
    input: 'email, password',
    output: 'accessToken, refreshToken, user',
    method: 'POST'
  },
  {
    path: '/auth/refresh',
    guard: '—',
    input: 'refreshToken',
    output: 'accessToken, refreshToken, user',
    method: 'POST'
  },
  {
    path: '/auth/logout',
    guard: '—',
    input: 'refreshToken',
    output: 'success: true',
    method: 'POST'
  },
  {
    path: '/auth/logout-all',
    guard: 'AuthGuard',
    input: '—',
    output: 'success: true',
    method: 'POST'
  },
  {
    path: '/auth/me',
    guard: 'AuthGuard',
    input: '—',
    output: 'id, name, email, created_at',
    method: 'GET'
  }
]

const PIPELINE: { note: string; label: string }[] = [
  { note: 'global', label: 'helmet' },
  { note: 'global', label: 'enableCors' },
  { note: 'global', label: 'LoggerInterceptor' },
  { note: 'global', label: 'ValidationPipe' },
  { note: 'só em 2 rotas', label: 'AuthGuard' },
  { note: 'AuthController', label: 'Rota' },
  { note: 'na saída, em erro', label: 'GlobalExceptionFilter' }
]

const SEQUENCES: IAboutCurrentFlowSequence[] = [
  {
    title: 'Login',
    steps: [
      {
        actor: 'cliente',
        title: 'Manda email e senha em JSON',
        detail: (
          <>
            <Code>POST /auth/login</Code> com o corpo <Code>{'{ email, password }'}</Code>. Nenhum
            cookie participa: quem vai guardar o que voltar é o cliente.
          </>
        )
      },
      {
        actor: 'api',
        title: 'ValidationPipe confere o LoginDto',
        detail: (
          <>
            <Code>@IsEmail</Code> e <Code>@IsNotEmpty</Code>, com <Code>whitelist</Code> e{' '}
            <Code>forbidNonWhitelisted</Code> ligados. Campo fora do DTO vira 400.
          </>
        )
      },
      {
        actor: 'banco',
        title: 'SELECT do usuário por email',
        detail: (
          <>
            <Code>findByEmailWithPassword</Code> traz a linha inteira, hash de senha incluído.
          </>
        )
      },
      {
        actor: 'api',
        title: 'bcrypt.compare roda sempre',
        detail:
          'Se o email não existe, a comparação acontece contra um hash de mentira, para o tempo de resposta não denunciar quais emails estão cadastrados. Cost factor 10, fixo no código.'
      },
      {
        actor: 'api',
        title: 'Falhou, é 401 genérico',
        detail: (
          <>
            <Code>Invalid credentials</Code>, a mesma mensagem para email inexistente e para senha
            errada.
          </>
        )
      },
      {
        actor: 'banco',
        title: 'INSERT em RefreshToken',
        detail: (
          <>
            Grava <Code>user_id</Code> e <Code>expires_at</Code>. O id gerado da linha é o{' '}
            <Code>jti</Code> que vai dentro do refresh token.
          </>
        )
      },
      {
        actor: 'api',
        title: 'Assina os dois JWTs',
        detail: (
          <>
            Access de 15 minutos e refresh de 14 dias, com o <strong>mesmo</strong> segredo. O que
            separa os dois é só a claim <Code>type</Code>.
          </>
        )
      },
      {
        actor: 'cliente',
        title: 'Recebe as duas strings no corpo',
        detail: (
          <>
            200 com <Code>{'{ accessToken, refreshToken, user }'}</Code>. Nenhum{' '}
            <Code>Set-Cookie</Code> é emitido, então onde guardar é decisão do cliente.
          </>
        )
      }
    ]
  },
  {
    title: 'Refresh e rotação',
    steps: [
      {
        actor: 'cliente',
        title: 'Reenvia o refresh token no corpo',
        detail: (
          <>
            <Code>POST /auth/refresh</Code> com <Code>{'{ refreshToken }'}</Code>. A rota não tem
            guard nenhum.
          </>
        )
      },
      {
        actor: 'api',
        title: 'Verifica a assinatura',
        detail: (
          <>
            <Code>verifyAsync</Code> sem <Code>algorithms</Code> fixado e sem conferir{' '}
            <Code>iss</Code> ou <Code>aud</Code>.
          </>
        )
      },
      {
        actor: 'api',
        title: 'Exige type refresh e jti',
        detail:
          'É o único freio contra apresentar um access token aqui: as duas classes de token saem do mesmo segredo.'
      },
      {
        actor: 'banco',
        title: 'consumeToken: SELECT e depois DELETE',
        detail:
          'A linha some na redenção, o que impede reuso em série. Como são duas instruções separadas, duas requisições simultâneas com o mesmo token passam as duas.'
      },
      {
        actor: 'api',
        title: 'Linha ausente vira 401 comum',
        detail:
          'Um refresh token vazado e já redimido é tratado como expiração normal. As outras sessões do usuário seguem vivas.'
      },
      {
        actor: 'banco',
        title: 'INSERT da linha nova',
        detail: 'Novo jti, novo par assinado, e o par anterior deixa de valer.'
      }
    ]
  },
  {
    title: 'Requisição autenticada',
    steps: [
      {
        actor: 'cliente',
        title: 'Manda o access token no header',
        detail: (
          <>
            <Code>Authorization: Bearer &lt;access&gt;</Code>, montado pelo próprio cliente a partir
            do que ele guardou.
          </>
        )
      },
      {
        actor: 'api',
        title: 'AuthGuard roda onde foi declarado',
        detail: (
          <>
            O guard não é global: hoje só <Code>GET /auth/me</Code> e{' '}
            <Code>POST /auth/logout-all</Code> têm <Code>@UseGuards(AuthGuard)</Code>.
          </>
        )
      },
      {
        actor: 'api',
        title: 'Confere esquema, assinatura e tipo',
        detail: (
          <>
            Exige o esquema <Code>bearer</Code>, valida o token e recusa quando{' '}
            <Code>type !== &apos;access&apos;</Code>, para um refresh de 14 dias não abrir rota
            protegida.
          </>
        )
      },
      {
        actor: 'api',
        title: 'Preenche request.user e segue',
        detail: (
          <>
            <Code>{'{ id, email }'}</Code> saem do payload. Qualquer recusa é um 401 seco, sem dizer
            qual checagem falhou.
          </>
        )
      }
    ]
  }
]

const GAPS: { id: string; text: ReactNode }[] = [
  {
    id: 'cookies',
    text: (
      <>
        Os tokens voltam no corpo da resposta. Nenhum cookie é emitido e o{' '}
        <Code>cookie-parser</Code> não está instalado.
      </>
    )
  },
  {
    id: 'guard',
    text: (
      <>
        O <Code>AuthGuard</Code> lê só <Code>Authorization</Code>, e não é global. Por isso o{' '}
        <Code>@Public()</Code> em login, register, refresh e logout não tem efeito algum: essas
        rotas não passam por guard nenhum.
      </>
    )
  },
  {
    id: 'secret',
    text: (
      <>
        Um único <Code>JWT_SECRET</Code> assina as duas classes de token. A separação é a claim{' '}
        <Code>type</Code>, conferida em dois lugares.
      </>
    )
  },
  {
    id: 'verify',
    text: (
      <>
        <Code>verifyAsync</Code> roda sem <Code>algorithms: [&apos;HS256&apos;]</Code>, sem{' '}
        <Code>issuer</Code> e sem <Code>audience</Code>.
      </>
    )
  },
  {
    id: 'csrf',
    text: (
      <>
        Nenhuma proteção de CSRF. <Code>X-CSRF-Token</Code> nem aparece em{' '}
        <Code>allowedHeaders</Code>.
      </>
    )
  },
  {
    id: 'rate-limit',
    text: <>Sem rate limiting: login, register e refresh aceitam tentativas ilimitadas.</>
  },
  {
    id: 'atomicity',
    text: (
      <>
        <Code>consumeToken</Code> faz SELECT e DELETE em instruções separadas, então o uso único não
        se sustenta sob concorrência.
      </>
    )
  },
  {
    id: 'reuse-detection',
    text: (
      <>Sem reuse detection: um refresh já redimido não revoga a família de tokens do usuário.</>
    )
  },
  {
    id: 'password-change',
    text: (
      <>
        <Code>updatePassword</Code> não chama <Code>invalidateAllUserTokens</Code>, então trocar a
        senha deixa a sessão do atacante viva por mais 14 dias.
      </>
    )
  },
  {
    id: 'bcrypt',
    text: (
      <>
        <Code>BCRYPT_ROUNDS</Code> está fixo em 10 dentro de <Code>users.service.ts</Code>, fora do
        config.
      </>
    )
  },
  {
    id: 'cors-list',
    text: (
      <>
        <Code>CORS_ORIGIN</Code> valida uma URI só. A allowlist separada por vírgula ainda não
        existe.
      </>
    )
  }
]

export const AboutCurrentFlow = () => (
  <div className='flex flex-col gap-y-[24px]'>
    <div className='flex flex-col gap-y-[12px]'>
      <p className='text-[13px] text-gray-600 font-[600] tracking-[0.06em] uppercase'>As rotas</p>

      <div className='overflow-x-auto'>
        <table className='w-full min-w-[560px] border-collapse text-[14px] text-left'>
          <thead>
            <tr>
              <th className='border border-gray-200 bg-gray-100 p-[10px] font-[600]'>Rota</th>
              <th className='border border-gray-200 bg-gray-100 p-[10px] font-[600]'>Guard</th>
              <th className='border border-gray-200 bg-gray-100 p-[10px] font-[600]'>Corpo</th>
              <th className='border border-gray-200 bg-gray-100 p-[10px] font-[600]'>Resposta</th>
            </tr>
          </thead>

          <tbody className='align-top leading-[1.5]'>
            {ROUTES.map((route) => (
              <tr key={route.path}>
                <td className='border border-gray-200 p-[10px]'>
                  <span
                    className={tw(
                      'mr-[6px] rounded-[4px] px-[6px] py-[2px] text-[11px] font-[600] tracking-[0.04em]',
                      route.method === 'GET'
                        ? 'bg-primary-50 text-primary-700'
                        : 'bg-gray-800 text-white'
                    )}
                  >
                    {route.method}
                  </span>

                  <Code>{route.path}</Code>
                </td>

                <td className='border border-gray-200 p-[10px]'>{route.guard}</td>
                <td className='border border-gray-200 p-[10px]'>{route.input}</td>
                <td className='border border-gray-200 p-[10px]'>{route.output}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className='flex flex-col gap-y-[12px]'>
      <p className='text-[13px] text-gray-600 font-[600] tracking-[0.06em] uppercase'>
        O caminho de toda requisição
      </p>

      <div className='flex flex-wrap items-center gap-[6px]'>
        {PIPELINE.map((stage, index) => (
          <div key={stage.label} className='flex items-center gap-[6px]'>
            <span className='flex flex-col rounded-[6px] bg-gray-100 px-[8px] py-[6px]'>
              <span className='text-[13px] text-gray-800 font-[600]'>{stage.label}</span>
              <span className='text-[11px] text-gray-600'>{stage.note}</span>
            </span>

            {index < PIPELINE.length - 1 && (
              <svg
                fill='none'
                strokeWidth='2'
                aria-hidden='true'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='w-[14px] h-[14px] shrink-0 text-gray-400'
              >
                <path d='M9 6l6 6-6 6' />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>

    {SEQUENCES.map((sequence) => (
      <div key={sequence.title} className='flex flex-col gap-y-[12px]'>
        <p className='text-[13px] text-gray-600 font-[600] tracking-[0.06em] uppercase'>
          {sequence.title}
        </p>

        <div className='flex flex-col'>
          {sequence.steps.map((step, index) => {
            const actor = ACTORS[step.actor]
            const isLast = index === sequence.steps.length - 1

            return (
              <div key={step.title} className='flex gap-x-[12px]'>
                <div className='flex flex-col items-center'>
                  <span
                    className={tw(
                      'shrink-0 w-[28px] h-[28px] flex items-center justify-center rounded-full text-[13px] font-[600]',
                      actor.badge
                    )}
                  >
                    {index + 1}
                  </span>

                  {!isLast && <span className='w-[2px] flex-1 bg-gray-200' />}
                </div>

                <div className={tw('flex flex-col gap-y-[6px]', !isLast && 'pb-[16px]')}>
                  <div className='flex flex-wrap items-center gap-[8px]'>
                    <span
                      className={tw(
                        'rounded-[4px] px-[6px] py-[2px] text-[11px] font-[600] tracking-[0.04em] uppercase',
                        actor.chip
                      )}
                    >
                      {actor.label}
                    </span>

                    <span className='text-[16px] text-black font-[600]'>{step.title}</span>
                  </div>

                  <p className='text-[15px] text-gray-700 leading-[1.6]'>{step.detail}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    ))}

    <div className='flex flex-col gap-y-[12px]'>
      <p className='text-[13px] text-gray-600 font-[600] tracking-[0.06em] uppercase'>
        Distância para o alvo
      </p>

      <ul className='flex flex-col gap-y-[8px]'>
        {GAPS.map((gap) => (
          <li
            key={gap.id}
            className='rounded-[6px] border-l-[2px] border-secondary-500 bg-secondary-200 px-[10px] py-[8px] text-[14px] text-secondary-900 leading-[1.5]'
          >
            {gap.text}
          </li>
        ))}
      </ul>
    </div>
  </div>
)
