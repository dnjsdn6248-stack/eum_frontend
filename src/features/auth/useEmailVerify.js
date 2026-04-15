import { useState } from 'react'
import { useSendEmailVerifyMutation, useVerifyEmailMutation } from '@/api/authApi'

export default function useEmailVerify({ onVerified }) {
  const [email, setEmailState] = useState('')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [verified, setVerified] = useState(false)
  const [sendError, setSendError] = useState('')
  const [verifyError, setVerifyError] = useState('')

  const [sendEmailVerify, { isLoading: isSending }] = useSendEmailVerifyMutation()
  const [verifyEmailMutation, { isLoading: isVerifying }] = useVerifyEmailMutation()

  const setEmail = (val) => {
    setEmailState(val)
    setCodeSent(false)
    setVerified(false)
  }

  const handleSend = async () => {
    if (!email) return
    setSendError('')
    try {
      await sendEmailVerify(email).unwrap()
      setCodeSent(true)
      setCode('')
      setVerifyError('')
    } catch (err) {
      setSendError(err?.data?.message || '인증 코드 발송에 실패했습니다.')
    }
  }

  const handleVerify = async () => {
    if (!code) return
    setVerifyError('')
    try {
      const cleanCode = code.trim().replace(/[^0-9]/g, '')
      await verifyEmailMutation({
        email: email.trim(),
        code: cleanCode,
      }).unwrap()
      setVerified(true)
      setTimeout(() => {
        onVerified(email)
      }, 800)
    } catch (err) {
      console.error("❌ 검증 에러 상세:", err)
      setVerifyError(err?.data?.message || '인증번호가 올바르지 않습니다.')
    }
  }

  return {
    email, setEmail,
    code, setCode,
    codeSent,
    verified,
    sendError,
    verifyError,
    isSending,
    isVerifying,
    handleSend,
    handleVerify,
  }
}
