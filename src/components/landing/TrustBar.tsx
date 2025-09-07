'use client'

import { Shield, Award, Lock } from 'lucide-react'

export default function TrustBar() {
  const companies = [
    'GOLDMAN SACHS',
    'JP MORGAN',
    'BLACKROCK',
    'MORGAN STANLEY',
    'CITI',
    'BANK OF AMERICA',
    'WELLS FARGO',
    'DEUTSCHE BANK',
  ]

  const certifications = [
    { icon: Shield, label: 'SOC2 Type II' },
    { icon: Lock, label: 'ISO 27001' },
    { icon: Award, label: 'GDPR Compliant' },
  ]

  return (
    <section className="py-16 border-t border-b border-gray-800">
      <div className="container mx-auto px-6">
        {/* Trust Headline */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500 font-mono uppercase tracking-wider mb-4">
            Trusted by Fortune 500 Finance Teams
          </p>
        </div>

        {/* Company Logos - Simulated with text */}
        <div className="relative overflow-hidden mb-12">
          <div className="flex gap-12 items-center justify-center flex-wrap">
            {companies.map((company, i) => (
              <div
                key={i}
                className="text-gray-600 font-mono text-sm hover:text-gray-400 transition-colors duration-300"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {company}
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {[
            { value: '500K+', label: 'Reports Generated', sublabel: 'Monthly average' },
            { value: '99.99%', label: 'Uptime SLA', sublabel: 'Guaranteed' },
            { value: '150+', label: 'Enterprise Clients', sublabel: 'Globally' },
            { value: '<50ms', label: 'Query Response', sublabel: 'P95 latency' },
          ].map((metric, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[#00BFFF] font-mono mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-gray-300">{metric.label}</div>
              <div className="text-xs text-gray-600 mt-1">{metric.sublabel}</div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="flex justify-center items-center gap-8">
          {certifications.map((cert, i) => {
            const Icon = cert.icon
            return (
              <div
                key={i}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-mono">{cert.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}