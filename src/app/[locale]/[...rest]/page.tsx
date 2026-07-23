import { notFound } from 'next/navigation'

// any unknown path inside a locale renders the localized 404
export default function CatchAll() {
  notFound()
}
