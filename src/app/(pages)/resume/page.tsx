'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { RiMailLine, RiFileCopy2Line } from 'react-icons/ri'

import { useTranslation } from '@/context'
import { RichTextViewer, ScrollToTopButton, Wrapper } from '@/components'
import { socialsResume } from '@/constants/socials'

export default function Resume() {
  const { translations, location } = useTranslation()

  const [loading, setLoading] = useState(false)

  const text = translations.resume.about.description

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(translations.resume.toast)
      })
      .catch(() => {
        toast.error('Error')
      })
  }

  const handleGeneratePDF = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: `${window.location.origin}${window.location.pathname}?lang=${location}`,
          language: location,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `resume-${location}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error) {
      console.error(error)
      alert('Failed to generate PDF')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Wrapper>
      <div className="flex flex-col gap-6 p-4 page-break-before: always">
        <div className="flex flex-row space-x-4 2xl:space-x-12 items-center">
          <Image
            src="/images/me_home.jpeg"
            alt="Profile photo"
            width={145}
            height={145}
            className="rounded-full border border-gray-900 dark:border-gray-50"
          />
          <div className="flex flex-col gap-1">
            <h4>{translations.resume.name}</h4>
            <p>{translations.resume.description}</p>
            <Link
              href="/"
              className="w-32 text-center rounded-full bg-black hover:bg-primary-color-800 border border-gray-200 
              dark:bg-white dark:border-gray-600 dark:hover:bg-primary-color-300 dark:hover:border-gray-600"
            >
              <p className="text-white dark:text-black">ffzanini.dev</p>
            </Link>
          </div>
        </div>
        {/* about section */}
        <div className="flex flex-col 2xl:flex-row gap-2 2xl:gap-6">
          <motion.a href="mailto:devffzanini@gmail.com" target="_blank">
            <div className="flex flex-row gap-1 items-center font-extrabold opacity-100 hover:opacity-80">
              <RiMailLine className="icon-body" />
              <p>{translations.resume.icos.mail}</p>
            </div>
          </motion.a>
          {/* Download estático: zero Edge/Serverless; gere os PDFs com npm run generate-pdfs */}
          <a
            href="/resume-pt.pdf"
            download="resume-pt.pdf"
            className="no-print flex flex-row gap-1 items-center font-extrabold opacity-100 hover:opacity-80"
          >
            <RiFileCopy2Line className="icon-body" />
            <p>{translations.resume.icos.pdf_click} (PT)</p>
          </a>
          <a
            href="/resume-en.pdf"
            download="resume-en.pdf"
            className="no-print flex flex-row gap-1 items-center font-extrabold opacity-100 hover:opacity-80"
          >
            <RiFileCopy2Line className="icon-body" />
            <p>{translations.resume.icos.pdf_click} (EN)</p>
          </a>
          <button
            type="button"
            onClick={handleGeneratePDF}
            disabled={loading}
            className="no-print flex flex-row gap-1 items-center font-extrabold opacity-100 hover:opacity-80 disabled:opacity-50"
          >
            <RiFileCopy2Line className="icon-body" />
            <p>{loading ? translations.resume.icos.pdf_loading : `${translations.resume.icos.pdf_click} (${location})`}</p>
          </button>
          <button onClick={copyToClipboard} className="no-print">
            <div className="flex flex-row gap-1 items-center font-extrabold opacity-100 hover:opacity-80">
              <RiFileCopy2Line className="icon-body" />
              <p>{translations.resume.icos.bio}</p>
            </div>
          </button>
        </div>
        {/* about section */}
        <div className="flex flex-col gap-3">
          <h3>{translations.resume.about.title}</h3>
          <p>{text}</p>
        </div>
        {/* links section */}
        <div className="flex flex-col gap-2">
          {socialsResume.map(({ href, icon: Icon, name, label }) => (
            <div key={name} className="flex flex-row gap-3 items-center">
              <Icon className="icon-footer" />
              <p>{name}</p>
              <motion.a href={href} target="_blank">
                {label}
              </motion.a>
            </div>
          ))}
        </div>
        {/* experience section */}
        <div className="flex flex-col gap-6 2xl:gap-3">
          <h3>{translations.resume.experience.title}</h3>
          {translations.resume.experience.information.map((exp) => (
            <div
              key={exp.id}
              className="flex flex-col 2xl:flex-row gap-1 pt-3 2xl:gap-4"
            >
              <div className="flex flex-row min-w-0 2xl:min-w-[220px]">
                <p>
                  {exp.initial_date} — {exp.final_date}
                </p>
              </div>
              <div className="flex flex-col">
                <motion.a
                  href={exp.link}
                  className="text-xl hover:underline"
                  target="_blank"
                >
                  {exp.title}
                </motion.a>
                <RichTextViewer content={exp.description} />
              </div>
            </div>
          ))}
        </div>
        {/* education section */}
        <div className="flex flex-col gap-3">
          <h3>{translations.resume.education.title}</h3>
          {translations.resume.education.information.map((edu) => (
            <div
              key={edu.id}
              className="flex flex-col 2xl:flex-row gap-1 pt-3 2xl:gap-4"
            >
              <div className="flex flex-row min-w-0 2xl:min-w-[220px]">
                <p>
                  {edu.initial_date} — {edu.final_date}
                </p>
              </div>
              <div className="flex flex-col">
                <motion.a
                  href={edu.link}
                  className="text-xl hover:underline"
                  target="_blank"
                >
                  {edu.title}
                </motion.a>
                <p>{edu.region}</p>
              </div>
            </div>
          ))}
        </div>
        {/* certifications section */}
        <div className="flex flex-col gap-3">
          <h3>{translations.resume.certifications.title}</h3>
          {translations.resume.certifications.information.map((cert) => (
            <div
              key={cert.id}
              className="flex flex-col 2xl:flex-row gap-1 pt-3 2xl:gap-4"
            >
              <div className="flex flex-row min-w-0 2xl:min-w-[220px]">
                <p>
                  {cert.initial_date} — {cert.final_date}
                </p>
              </div>
              <div className="flex flex-col">
                <h4>{cert.title}</h4>
                <p>{cert.region}</p>
              </div>
            </div>
          ))}
        </div>
        {/* skills section */}
        <div className="flex flex-col gap-3">
          <h3>{translations.resume.skills.title}</h3>
          {translations.resume.skills.information.map((skill) => (
            <div key={skill.id} className="flex flex-col gap-1 pt-3">
              <h4>{skill.title}</h4>
              <p>{skill.desciption}</p>
            </div>
          ))}
        </div>

        {/* language section */}
        <div className="flex flex-col gap-3">
          <h3>{translations.resume.language.title}</h3>
          {translations.resume.language.information.map((lang) => (
            <div key={lang.id} className="flex flex-col gap-1 pt-3">
              <h4>{lang.title}</h4>
              <p>{lang.desciption}</p>
            </div>
          ))}
        </div>
      </div>

      <ScrollToTopButton />
    </Wrapper>
  )
}
