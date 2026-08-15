import { ChoiceCard } from '../../ui/Field'
import {
  paymentOptions,
  installmentBanks,
  installmentTerms,
  type PaymentMethod,
} from '../../lib/checkout'

type Props = {
  method: PaymentMethod | ''
  onMethod: (m: PaymentMethod) => void
  bank: string
  onBank: (b: string) => void
  terms: number
  onTerms: (t: number) => void
}

export function PaymentSection({ method, onMethod, bank, onBank, terms, onTerms }: Props) {
  return (
    <section aria-labelledby="payment-heading" className="mt-10">
      <h2 id="payment-heading" className="text-lg">
        付款方式
      </h2>

      <div className="mt-4 space-y-3">
        {paymentOptions.map((opt) => (
          <ChoiceCard
            key={opt.value}
            name="payment"
            value={opt.value}
            checked={method === opt.value}
            onChange={(v) => onMethod(v as PaymentMethod)}
            title={opt.title}
            description={opt.description}
          >
            {opt.value === 'installment' && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-ink-900">選擇銀行</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {installmentBanks.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => onBank(b)}
                        aria-pressed={bank === b}
                        className={`rounded-full px-4 py-2 text-sm font-medium ring-1 transition-colors ${
                          bank === b
                            ? 'bg-felt-600 text-white ring-felt-600'
                            : 'bg-white text-ink-700 ring-line hover:ring-felt-200'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-ink-900">分期期數</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {installmentTerms.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => onTerms(t)}
                        aria-pressed={terms === t}
                        className={`rounded-full px-4 py-2 text-sm font-medium ring-1 transition-colors ${
                          terms === t
                            ? 'bg-felt-600 text-white ring-felt-600'
                            : 'bg-white text-ink-700 ring-line hover:ring-felt-200'
                        }`}
                      >
                        {t} 期
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-ink-400">＊分期利率與手續費依銀行公告，正式資訊由金流商提供</p>
              </div>
            )}

            {(opt.value === 'atm' || opt.value === 'cvs') && (
              <p className="flex items-start gap-2.5 rounded-lg bg-brass-400/10 px-4 py-3 text-sm text-brass-600">
                <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 fill-current">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 3.5a1 1 0 011 1V11a1 1 0 11-2 0V6.5a1 1 0 011-1zm0 9.5a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2z" />
                </svg>
                建立訂單後請於 3 天內完成繳費，逾期訂單將自動取消。
              </p>
            )}
          </ChoiceCard>
        ))}
      </div>
    </section>
  )
}
