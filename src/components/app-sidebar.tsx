"use client"

import { Coins, CreditCard, Home, ShoppingCart, Wallet, TrendingUp, User, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

const menuItems = [
	{
		title: "Overview",
		url: "/",
		icon: Home,
	},
	{
		title: "Assets",
		url: "/assets",
		icon: Coins,
	},
	{
		title: "Orders",
		url: "/orders",
		icon: ShoppingCart,
	},
	{
		title: "Crypto Wallet",
		url: "/wallets",
		icon: Wallet,
	},
	{
		title: "Cards",
		url: "/cards",
		icon: CreditCard,
	},
]

export function AppSidebar() {
	const pathname = usePathname()
	const router = useRouter()
	const [userData, setUserData] = useState<any>(null)

	useEffect(() => {
		const user = localStorage.getItem("user")
		if (user) {
			setUserData(JSON.parse(user))
		}
	}, [])

	const handleLogout = () => {
		localStorage.removeItem("user")
		router.push("/auth")
	}

	// Show My Profile como primeiro item, mas sem remover Overview
	const shouldShowProfile = userData && !userData.profileCompleted
	const activeItems = shouldShowProfile
		? [{ title: "My Profile", url: "/profile", icon: User }, ...menuItems]
		: menuItems

	return (
		<aside className="sidebar-width full-screen backdrop-blur-md bg-white/90 border-r border-black/10 flex flex-col shadow-lg">
			{/* Logo */}
			<div className="p-8 border-b border-black/10">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
						<TrendingUp className="w-6 h-6" />
					</div>
					<div>
						<h1 className="text-xl font-semibold text-main">OND4</h1>
						<p className="text-sm muted-text">Dashboard</p>
					</div>
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex-1 p-6">
				<ul className="space-y-2">
					{activeItems.map((item) => {
						const isActive =
							pathname === item.url ||
							(shouldShowProfile && item.title === "My Profile" && pathname === "/profile") ||
							(item.title === "Overview" && pathname === "/" && !shouldShowProfile)
						return (
							<li key={item.title}>
								<Link
									href={item.url}
									className={`flex items-center gap-3 px-4 py-3 rounded-lg smooth-transition font-medium ${
										isActive
											? "backdrop-blur-sm bg-primary/10 text-primary border border-primary/20 shadow-sm"
											: "text-main hover:backdrop-blur-sm hover:bg-black/5 hover:text-primary hover:shadow-sm"
									}`}
								>
									<item.icon className="w-5 h-5" />
									<span>{item.title}</span>
								</Link>
							</li>
						)
					})}
				</ul>
			</nav>

			{/* User Info & Logout */}
			{userData && (
				<div className="p-6 border-t border-black/10 space-y-4">
					<div className="backdrop-blur-sm bg-black/5 p-4 rounded-lg border border-black/10 shadow-sm">
						<div className="flex items-center gap-3 mb-3">
							<div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
								<User className="w-4 h-4" />
							</div>
							<div className="flex-1 min-w-0">
								<div className="text-sm font-medium text-main truncate">
									{userData.name || userData.email}
								</div>
								<div className="text-xs muted-text">
									{userData.profileCompleted ? "Verified" : "Profile Incomplete"}
								</div>
							</div>
						</div>
						<Button
							onClick={handleLogout}
							variant="outline"
							size="sm"
							className="w-full glass-button bg-transparent text-red-600 hover:text-red-700 hover:border-red-200"
						>
							<LogOut className="w-4 h-4 mr-2" />
							Logout
						</Button>
					</div>
				</div>
			)}
		</aside>
	)
}
