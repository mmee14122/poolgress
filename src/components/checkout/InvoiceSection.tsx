import { ChoiceCard, Field, TextInput } from '../../ui/Field'
import {
  donationTargets,
  type InvoiceType,
  type Carrier,
  type FieldErrors,
} from '../../lib/checkout'

type Props = {
  invoiceType: InvoiceType
  onInvoiceType: (t: InvoiceType) => void
  carrier: Carrier
  onCarrier: (c: Carrier) => void
  mobileCode: string
  onMobileCode: (v: string) => void
  certCode: string
  onCertCode: (v: string) => void
  donateTarget: string
  onDonateTarget: (v: string) => void
  donateCode: string
  onDonateCode: (v: string) => void
  company: { name: string; taxId: string; address: string }
  onCompany: (c: { name: string; taxId: string; address: string }) => void
  /** 結帳 Email（會員載具顯示用） */
  buyerEmail: string
  errors: FieldErrors
}

const carrierOptions: { value: Carrier; label: string }[] = [
  { value: 'member', label: '會員載具（使用結帳 Email）' },
  { value: 'mobile', label: '手機條碼' },
  { value: 'cert', label: '自然人憑證條碼' },
]

export function InvoiceSection(props: Props) {
  const { invoiceType, onInvoiceType, errors } = props
  /* 格式錯誤在欄位有內容時立即顯示；必填缺漏由訂單明細摘要提示 */
  const err = (k: string, value: string) => (value.trim() ? (errors[k] ?? null) : null)

  return (
    <section aria-labelledby="invoice-heading" className="mt-10">
      <h2 id="invoice-heading" className="text-lg">
        發票設定
      </h2>

      <div className="mt-4 space-y-3">
        {/* 電子發票（個人） */}
        <ChoiceCard
          name="invoice"
          value="personal"
          checked={invoiceType === 'personal'}
          onChange={() => onInvoiceType('personal')}
          title="電子發票（個人）"
        >
          <div className="space-y-3">
            <p className="text-sm font-semibold text-ink-900">發票載具</p>
            {carrierOptions.map((c) => (
              <label key={c.value} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-700">
                <input
                  type="radio"
                  name="carrier"
                  checked={props.carrier === c.value}
                  onChange={() => props.onCarrier(c.value)}
                  className="h-4 w-4 accent-brand-600"
                />
                {c.label}
              </label>
            ))}

            {props.carrier === 'member' && (
              <p className="rounded-lg bg-ivory-50 px-4 py-3 text-sm text-ink-500">
                發票將存入會員載具：
                <strong className="font-semibold text-ink-900">
                  {props.buyerEmail || '（請先填寫結帳 Email）'}
                </strong>
              </p>
            )}
            {props.carrier === 'mobile' && (
              <Field label="手機條碼" required error={err('mobileCode', props.mobileCode)} hint="斜線開頭共 8 碼，例：/ABC+123">
                {(id, invalid) => (
                  <TextInput
                    id={id}
                    placeholder="/ABC+123"
                    value={props.mobileCode}
                    invalid={invalid}
                    onChange={(e) => props.onMobileCode(e.target.value.toUpperCase())}
                  />
                )}
              </Field>
            )}
            {props.carrier === 'cert' && (
              <Field label="自然人憑證條碼" required error={err('certCode', props.certCode)} hint="2 碼大寫英文 + 14 碼數字">
                {(id, invalid) => (
                  <TextInput
                    id={id}
                    placeholder="AB12345678901234"
                    value={props.certCode}
                    invalid={invalid}
                    onChange={(e) => props.onCertCode(e.target.value.toUpperCase())}
                  />
                )}
              </Field>
            )}
          </div>
        </ChoiceCard>

        {/* 捐贈發票 */}
        <ChoiceCard
          name="invoice"
          value="donate"
          checked={invoiceType === 'donate'}
          onChange={() => onInvoiceType('donate')}
          title="捐贈發票"
        >
          <div className="space-y-3">
            <Field label="捐贈單位" required error={null}>
              {(id) => (
                <select
                  id={id}
                  value={props.donateTarget}
                  onChange={(e) => props.onDonateTarget(e.target.value)}
                  className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink-900 focus:outline-2 focus:outline-offset-1 focus:outline-brand-600"
                >
                  {donationTargets.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              )}
            </Field>
            {props.donateTarget === 'custom' && (
              <Field label="捐贈碼" required error={err('donateCode', props.donateCode)} hint="3 至 7 碼數字">
                {(id, invalid) => (
                  <TextInput
                    id={id}
                    inputMode="numeric"
                    placeholder="123"
                    value={props.donateCode}
                    invalid={invalid}
                    onChange={(e) => props.onDonateCode(e.target.value)}
                  />
                )}
              </Field>
            )}
          </div>
        </ChoiceCard>

        {/* 公司戶發票 */}
        <ChoiceCard
          name="invoice"
          value="company"
          checked={invoiceType === 'company'}
          onChange={() => onInvoiceType('company')}
          title="公司戶發票（統一編號）"
        >
          <div className="space-y-4">
            <Field label="公司名稱" required error={err('companyName', props.company.name)}>
              {(id, invalid) => (
                <TextInput
                  id={id}
                  placeholder="○○股份有限公司"
                  value={props.company.name}
                  invalid={invalid}
                  onChange={(e) => props.onCompany({ ...props.company, name: e.target.value })}
                />
              )}
            </Field>
            <Field label="統一編號" required error={err('companyTaxId', props.company.taxId)} hint="8 碼數字">
              {(id, invalid) => (
                <TextInput
                  id={id}
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="12345678"
                  value={props.company.taxId}
                  invalid={invalid}
                  onChange={(e) => props.onCompany({ ...props.company, taxId: e.target.value })}
                />
              )}
            </Field>
            <Field label="公司地址" error={null} hint="選填；依金流規格需要時填寫">
              {(id) => (
                <TextInput
                  id={id}
                  autoComplete="street-address"
                  value={props.company.address}
                  onChange={(e) => props.onCompany({ ...props.company, address: e.target.value })}
                />
              )}
            </Field>
          </div>
        </ChoiceCard>
      </div>
    </section>
  )
}
