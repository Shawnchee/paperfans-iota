"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Atom, Menu, Moon, Sun, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConnectButton } from '@iota/dapp-kit';

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();

  const navItems = [
    { href: "/", label: "Research" },
    { href: "/about", label: "About" },
    { href: "/docs", label: "Documentation" },
    { href: "/onramp", label: "Onramping & Wallet" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-neon-cyan/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex items-center space-x-4 group"
          >
            <div className="relative">
              <Atom className="text-neon-cyan text-2xl animate-pulse group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-neon-cyan/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
            </div>
            <h1 className="text-xl font-mono font-bold neon-cyan group-hover:scale-105 transition-transform duration-300">
              PaperFans
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:text-neon-cyan transition-colors duration-300 ${
                  pathname === item.href ? "neon-cyan" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Connect Wallet Button */}
            <ConnectButton />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-white/10"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.avatar_url}
                        alt={user.name || user.email}
                      />
                      <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan">
                        {user.name
                          ? user.name.charAt(0).toUpperCase()
                          : user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-sci-fi-dark border-neon-cyan/30"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-white">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-neon-cyan/20" />
                  <DropdownMenuItem asChild>
                    <Link href="/create-project" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Create Project</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={signOut}
                    className="cursor-pointer text-red-400 hover:text-red-300"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button className="sci-fi-button px-4 py-2 text-white font-semibold">
                  <span className="relative z-10">Sign In</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <ConnectButton />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-white/10"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="neon-cyan hover:bg-white/10"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="glass-effect border-white/20">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`hover:text-neon-cyan transition-colors duration-300 ${
                        pathname === item.href ? "neon-cyan" : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {user ? (
                    <>
                      <Link href="/create-project">
                        <Button className="mt-4 sci-fi-button text-white font-semibold w-full">
                          <span className="relative z-10">Create Project</span>
                        </Button>
                      </Link>
                      <Button
                        onClick={signOut}
                        variant="outline"
                        className="mt-2 w-full text-red-400 hover:text-red-300"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Link href="/auth">
                      <Button className="mt-4 sci-fi-button text-white font-semibold w-full">
                        <span className="relative z-10">Sign In</span>
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
