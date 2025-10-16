import { csvRecruiters } from '../lib/data'
import ClientHomePage from '../components/ClientHomePage'

export default function HomePage() {
  // Server-side render with default data, then hydrate with client-side functionality
  return <ClientHomePage initialRecruiters={csvRecruiters} />
}