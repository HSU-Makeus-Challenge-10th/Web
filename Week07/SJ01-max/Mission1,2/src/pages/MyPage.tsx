import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'
import { apiUpdateMe, apiUploadFile } from '../api/client'

function AvatarPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-600">
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12 text-gray-400">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  )
}

export default function MyPage() {
  const { user, updateUser } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar ?? null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      let avatar = user?.avatar ?? null
      if (avatarFile) {
        try { avatar = await apiUploadFile(avatarFile) } catch { /* 업로드 실패 시 유지 */ }
      }
      const payload: { name?: string; bio?: string; avatar?: string | null } = {}
      if (name.trim()) payload.name = name.trim()
      if (bio.trim()) payload.bio = bio.trim()
      payload.avatar = avatar
      return apiUpdateMe(payload)
    },
    onSuccess: (updatedUser) => {
      updateUser(updatedUser)
      setIsEditing(false)
      setAvatarFile(null)
    },
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setAvatarFile(f)
    setAvatarPreview(URL.createObjectURL(f))
  }

  const handleStartEdit = () => {
    setName(user?.name ?? '')
    setBio(user?.bio ?? '')
    setAvatarPreview(user?.avatar ?? null)
    setAvatarFile(null)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setAvatarFile(null)
    setAvatarPreview(user?.avatar ?? null)
  }

  return (
    <div style={{ padding: '24px', maxWidth: '480px', margin: '0 auto' }}>

      {/* ── 카드 ── */}
      <div style={{ background: '#1c1c2e', borderRadius: '16px', padding: '24px' }}>

        {/* 카드 헤더: 타이틀 + 설정 버튼 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>마이페이지</h1>
          {!isEditing && (
            <button
              onClick={handleStartEdit}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: '#2c2c3e', border: 'none', borderRadius: '8px',
                padding: '6px 12px', color: '#ccc', fontSize: '13px', cursor: 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              설정
            </button>
          )}
        </div>

        {isEditing ? (
          /* ── 수정 모드 ── */
          <>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
              {/* 프로필 이미지 */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '110px', height: '110px', borderRadius: '50%',
                  overflow: 'hidden', flexShrink: 0, cursor: 'pointer',
                  border: 'none', background: 'transparent', padding: 0,
                }}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <AvatarPlaceholder />
                )}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />

              {/* 필드 */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* 이름 + 체크 */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: '#2c2c3e', borderRadius: '8px', padding: '10px 14px',
                  border: '1px solid #3a3a5c',
                }}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름"
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '14px' }}
                  />
                  <button
                    onClick={() => mutate()}
                    disabled={isPending}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0 }}
                    title="저장"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>
                </div>

                {/* bio */}
                <div style={{
                  background: '#2c2c3e', borderRadius: '8px', padding: '10px 14px',
                  border: '1px solid #3a3a5c',
                }}>
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="소개 (선택)"
                    style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '14px' }}
                  />
                </div>

                {/* 이메일 */}
                <p style={{ color: '#888', fontSize: '13px', paddingLeft: '2px' }}>{user?.email}</p>

                {error && <p style={{ color: '#f87171', fontSize: '12px' }}>프로필 수정에 실패했습니다.</p>}
              </div>
            </div>

            {/* 저장/취소 버튼 */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
              <button
                onClick={() => mutate()}
                disabled={isPending}
                style={{
                  flex: 1, background: '#ec4899', border: 'none', borderRadius: '8px',
                  padding: '10px', color: '#fff', fontWeight: 600, fontSize: '14px',
                  cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.5 : 1,
                }}
              >
                {isPending ? '저장 중...' : '저장'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isPending}
                style={{
                  flex: 1, background: '#3a3a5c', border: 'none', borderRadius: '8px',
                  padding: '10px', color: '#ccc', fontWeight: 600, fontSize: '14px',
                  cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.5 : 1,
                }}
              >
                취소
              </button>
            </div>
          </>
        ) : (
          /* ── 조회 모드 ── */
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden' }}>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <AvatarPlaceholder />
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#2c2c3e', borderRadius: '8px', padding: '12px 16px' }}>
                <span style={{ width: '52px', color: '#888', flexShrink: 0 }}>이름</span>
                <span style={{ color: '#fff' }}>{user?.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#2c2c3e', borderRadius: '8px', padding: '12px 16px' }}>
                <span style={{ width: '52px', color: '#888', flexShrink: 0 }}>이메일</span>
                <span style={{ color: '#fff' }}>{user?.email}</span>
              </div>
              {user?.bio && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#2c2c3e', borderRadius: '8px', padding: '12px 16px' }}>
                  <span style={{ width: '52px', color: '#888', flexShrink: 0 }}>소개</span>
                  <span style={{ color: '#fff' }}>{user.bio}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
