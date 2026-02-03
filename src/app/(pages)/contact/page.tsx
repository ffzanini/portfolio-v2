'use client'
import { useForm } from 'react-hook-form'

import toast from 'react-hot-toast'
import axios from 'axios'

import { useTranslation } from '@/context'
import { RichTextViewer, Wrapper } from '@/components'

export default function Contact() {
  const { translations } = useTranslation()

  return (
    <Wrapper>
      <div className="flex flex-col gap-2 p-4">
        <h1 className="font-bold">{translations.contact.title}</h1>
        <RichTextViewer content={translations.contact.sub_title} />
        <div className="flex pt-20 gap-20 2xl:gap-8 flex-col">
          <ContactForm />
        </div>
      </div>
    </Wrapper>
  )
}

function ContactForm() {
  const { translations } = useTranslation()

  const { register, handleSubmit, formState, reset } = useForm<{
    name: string
    email: string
    message: string
  }>({
    reValidateMode: 'onChange',
  })

  const enableSubmit = formState.isDirty && formState.isValid

  const onSubmit = handleSubmit(({ name, email, message }) => {
    toast.promise(
      axios
        .post('/api/contact', {
          name,
          email,
          message,
        })
        .then(() => {
          reset()
        }),
      {
        loading: translations.contact.loading,
        success: translations.contact.success,
        error: translations.contact.error,
      },
    )
  })

  return (
    <form className="flex-1 flex flex-col gap-12" onSubmit={onSubmit}>
      <input
        {...register('name', { required: true })}
        placeholder={translations.contact.form.name}
      />
      <input
        {...register('email', {
          required: true,
          pattern: /\S+@\S+\.\S+/,
        })}
        placeholder={translations.contact.form.email}
      />
      <textarea
        {...register('message', { required: true })}
        placeholder={translations.contact.form.message}
      />
      <div className="flex flex-col 2xl:flex-row justify-center pb-4 2xl:pb-0 2xl:justify-center">
        <button
          disabled={!enableSubmit}
          type="submit"
          className="disabled:grayscale disabled:cursor-not-allowed
          text-center rounded-full bg-black hover:bg-primary-color-800 border border-gray-200 
          dark:bg-white  dark:border-gray-600 dark:hover:bg-primary-color-300 dark:hover:border-gray-600"
        >
          <p className="text-white dark:text-black px-2 py-2 2xl:px-12 2xl:py-4">
            {translations.contact.button_text}
          </p>
        </button>
      </div>
    </form>
  )
}
