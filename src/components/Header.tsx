import React from 'react'
import { cn } from '@/lib/utils'
import { ListFilter, Sun, Moon, User2Icon } from 'lucide-react'
import Image from 'next/image'
import Logo from '../../public/logo_disperindag.png'
import { Button } from './ui/button'
import { useTheme } from 'next-themes'
import Link from 'next/link'

interface HeaderProps {
  className?: string
  setAllCommoditiesOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const Header = ({ className, setAllCommoditiesOpen }: HeaderProps) => {
  const { theme, setTheme } = useTheme()
  return (
    <header
      className={cn(
        'flex flex-col md:flex-row items-center justify-between py-4 px-6 glass-panel rounded-xl mb-6',
        className
      )}
    >
      <div className="flex items-center mb-4 md:mb-0">
        <div className="dark:bg-white/60 bg-background/50 rounded-lg  p-2 mr-2">
          <Image
            src={Logo}
            alt="Logo"
            blurDataURL="data:image/png;base64,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"
            placeholder="blur"
            className="h-10 w-36 md:h-6 md:w-32 mr-2 text-primary"
          />
        </div>
        <h1 className="text-xl font-semibold"></h1>
      </div>

      <div className="flex justify-center space-x-1 items-center w-full md:w-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAllCommoditiesOpen(true)}
          className="text-xs"
        >
          <ListFilter className="h-3.5 w-3.5 mr-1" />
          Semua Komoditas
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-xs"
        >
          {theme === 'dark' ? (
            <Moon className="h-3.5 w-3.5 mr-1" />
          ) : (
            <Sun className="h-3.5 w-3.5 mr-1" />
          )}
        </Button>
        <Link href={'/'}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Belum dibuat\nHanya Prototipe saja')}
            className="text-xs"
          >
            <User2Icon className="h-3.5 w-3.5 mr-1" />
            Login
          </Button>
        </Link>
      </div>
    </header>
  )
}

export default Header
