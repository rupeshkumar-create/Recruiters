import Link from 'next/link'
import { ArrowLeft, UserX } from 'lucide-react'
import { Button } from '../../../components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <UserX className="w-10 h-10 text-orange-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Recruiter Not Found</h1>
        <p className="text-gray-600 mb-8">
          The recruiter profile you're looking for doesn't exist or may have been removed.
        </p>
        
        <Link href="/">
          <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Directory
          </Button>
        </Link>
      </div>
    </div>
  )
}