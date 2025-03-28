"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { DropdownMenuContent } from "@/components/ui/dropdown-menu"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { DropdownMenu } from "@/components/ui/dropdown-menu"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Filter, ChevronDown, Eye, MoreHorizontal, Trophy, Users, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ColumnDef } from "@tanstack/react-table"

// Import components
import Navbar from "@/components/Navbar"
import { Footer } from "@/components/NewsletterFooter"

// Import API utilities
import {
  fetchGiveawaysAdmin,
  fetchGiveawayEntries,
  selectWinner,
  type FormattedGiveaway,
  type GiveawayEntry,
  fetchGiveawayWinner,
} from "@/lib/api"

// Add at the top of your file after other imports
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
// Add these imports at the top
import { getWinnerMailtoLink } from "@/lib/api"
import { Check, Mail, Copy } from "lucide-react"
// Add these imports at the top of your AdminGiveawaysPage file

interface Giveaway {
  id: string
  name: string
  status: string
  startDate: string
  endDate: string
}

const columns: ColumnDef<Giveaway>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
  },
  {
    accessorKey: "endDate",
    header: "End Date",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const giveaway = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 text-gray-300" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(giveaway.id)}>
              Copy giveaway ID
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function AdminGiveawaysPage() {
  const [giveaways, setGiveaways] = useState<(FormattedGiveaway & { views?: number })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedGiveaway, setSelectedGiveaway] = useState<FormattedGiveaway | null>(null)
  const [entries, setEntries] = useState<GiveawayEntry[]>([])
  const [entriesLoading, setEntriesLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [pickingWinner, setPickingWinner] = useState(false)
  const [winner, setWinner] = useState<GiveawayEntry | null>(null)
  const { user, isAdmin, logout } = useAuth()
  const router = useRouter()

  const [notifying, setNotifying] = useState(false)
  const [notificationSent, setNotificationSent] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage] = useState(10)

  // Calculate total pages
  const totalPages = Math.ceil(entries.length / entriesPerPage)

  // Get current entries
  const indexOfLastEntry = currentPage * entriesPerPage
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage
  const currentEntries = entries.slice(indexOfFirstEntry, indexOfLastEntry)

  // Add this function to reset the notification state when changing giveaways
  const handleSelectGiveaway = (giveaway: FormattedGiveaway) => {
    setSelectedGiveaway(giveaway)
    setWinner(null) // Reset winner when changing giveaways
    setNotificationSent(false) // Reset notification state
    setNotifying(false)
    setCurrentPage(1) // Reset to first page when changing giveaways
  }

  const handleNotifyWinner = async (winner: GiveawayEntry) => {
    if (!selectedGiveaway) {
      console.error("No giveaway selected")
      return
    }

    console.log("Notifying winner:", winner.email, "for giveaway:", selectedGiveaway.title)
    setNotifying(true)

    try {
      // Use fetch to call your API endpoint instead
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          winnerEmail: winner.email,
          winnerName: winner.name,
          giveawayTitle: selectedGiveaway.title,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setNotificationSent(true)
        console.log("Email notification sent successfully")
      } else {
        console.error("API error:", result.error)
        // Fall back to mailto: link
        const mailtoLink = getWinnerMailtoLink(winner.email, selectedGiveaway.title)
        window.location.href = mailtoLink
        setNotificationSent(true)
      }
    } catch (error) {
      console.error("Failed to notify winner:", error)

      // Fallback to mailto: link
      const mailtoLink = getWinnerMailtoLink(winner.email, selectedGiveaway.title)
      window.location.href = mailtoLink
      setNotificationSent(true)
    } finally {
      setNotifying(false)
    }
  }

  // Add useEffect to check auth status
  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/admin/login")
    }
  }, [loading, isAdmin, router])

  // Fetch giveaways
  useEffect(() => {
    async function loadGiveaways() {
      try {
        setLoading(true)

        // Fetch the giveaways
        const data = await fetchGiveawaysAdmin()
        setGiveaways(data)

        // Select the first giveaway by default
        if (data.length > 0 && !selectedGiveaway) {
          setSelectedGiveaway(data[0])
        }

        setError(null)
      } catch (err) {
        console.error("Failed to load giveaways:", err)
        setError("Failed to load giveaways. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadGiveaways()

    // Set up an interval to refresh the giveaways list every minute to update calculated statuses
    const intervalId = setInterval(async () => {
      try {
        const updatedData = await fetchGiveawaysAdmin()
        setGiveaways(updatedData)
      } catch (err) {
        console.error("Failed to update giveaways:", err)
      }
    }, 60000) // Check every minute

    return () => clearInterval(intervalId) // Clean up on unmount
  }, [])

  // Fetch entries when selected giveaway changes
  useEffect(() => {
    async function loadEntriesAndWinner() {
      if (!selectedGiveaway) return

      try {
        setEntriesLoading(true)

        const entriesData = await fetchGiveawayEntries(selectedGiveaway.id)
        setEntries(entriesData)
        setCurrentPage(1) // Reset to first page when changing giveaways

        // Also fetch the winner if this giveaway has ended
        if (selectedGiveaway.status === "ended") {
          const winnerData = await fetchGiveawayWinner(selectedGiveaway.id)
          if (winnerData) {
            setWinner(winnerData)
          } else {
            setWinner(null)
          }
        }
      } catch (err) {
        console.error("Failed to load entries or winner:", err)
      } finally {
        setEntriesLoading(false)
      }
    }

    loadEntriesAndWinner()
  }, [selectedGiveaway])

  // Handle picking a winner
  const handlePickWinner = async () => {
    if (!selectedGiveaway) return

    // Ensure the giveaway has ended
    if (selectedGiveaway.status !== "ended") {
      console.error("Cannot pick a winner for a giveaway that hasn't ended yet")
      return
    }

    try {
      setPickingWinner(true)

      // First check if there's already a winner
      const existingWinner = await fetchGiveawayWinner(selectedGiveaway.id)
      if (existingWinner) {
        setWinner(existingWinner)
      } else {
        // If no winner exists, select one
        const winnerEntry = await selectWinner(selectedGiveaway.slug)
        setWinner(winnerEntry)
      }

      // Refresh entries to show the winner
      const updatedEntries = await fetchGiveawayEntries(selectedGiveaway.id)
      setEntries(updatedEntries)
    } catch (err) {
      console.error("Failed to pick winner:", err)
    } finally {
      setPickingWinner(false)
    }
  }

  // Filter giveaways by status
  const filteredGiveaways = giveaways.filter((giveaway) => statusFilter === "all" || giveaway.status === statusFilter)

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-500 bg-green-500/20 border-green-500"
      case "upcoming":
        return "text-blue-500 bg-blue-500/20 border-blue-500"
      case "ended":
        return "text-gray-400 bg-gray-500/20 border-gray-400"
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-[#07071C] text-white">
      {/* Background elements */}
      <div className="fixed inset-0 bg-[#07071C] overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[10%] left-[5%] w-[30rem] h-[30rem] rounded-full bg-[#F7984A]/5 blur-[8rem]"></div>
          <div className="absolute bottom-[10%] right-[5%] w-[25rem] h-[25rem] rounded-full bg-[#F7984A]/5 blur-[8rem]"></div>
          <div className="absolute top-[40%] right-[15%] w-[20rem] h-[20rem] rounded-full bg-blue-500/5 blur-[8rem]"></div>
        </div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-[0.015]"></div>
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Dashboard Title */}

          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-4 backdrop-blur-sm">
                <Users className="h-4 w-4 mr-2 text-[#F7984A]" />
                Admin Dashboard
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Giveaway Management</h1>
            </div>

            {/* Add the logout button here */}
            <div className="flex items-center space-x-4">
              {user && (
                <div className="text-gray-300 text-sm hidden md:block">
                  Logged in as <span className="text-white font-medium">{user.username}</span>
                </div>
              )}
              <Button
                onClick={logout}
                variant="outline"
                className="border border-gray-700 bg-black hover:bg-white hover:text-black text-gray-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="inline-block w-12 h-12 border-4 border-[#F7984A] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg text-gray-300">Loading giveaways...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="max-w-xl mx-auto text-center py-16">
              <div className="bg-red-500/10 p-6 rounded-xl border border-red-500/20 mb-6">
                <p className="text-red-400">{error}</p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Content when data is loaded */}
          {!loading && !error && (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-[#0D0B26]/80 border border-gray-800/50 p-6 hover:border-gray-700/60 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-300 font-medium">Active Giveaways</h3>
                    <div className="p-2 bg-green-500/20 rounded-full">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {giveaways.filter((g) => g.status === "active").length}
                  </p>
                  <div className="mt-4 text-sm text-gray-300">Total Active giveaways</div>
                </Card>

                <Card className="bg-[#0D0B26]/80 border border-gray-800/50 p-6 hover:border-gray-700/60 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-300 font-medium">Total Entries</h3>
                    <div className="p-2 bg-[#F7984A]/20 rounded-full">
                      <Users className="h-4 w-4 text-[#F7984A]" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {giveaways.reduce((sum, giveaway) => sum + giveaway.entries, 0).toLocaleString()}
                  </p>
                  <div className="mt-4 text-sm text-gray-300">Total Entries giveaways</div>
                </Card>

                <Card className="bg-[#0D0B26]/80 border border-gray-800/50 p-6 hover:border-gray-700/60 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-300 font-medium">Ended Giveaways</h3>
                    <div className="p-2 bg-gray-500/20 rounded-full">
                      <div className="h-4 w-4 flex items-center justify-center text-gray-400">#</div>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {giveaways.filter((g) => g.status === "ended").length}
                  </p>
                  <div className="mt-4 text-sm text-gray-300">Total completed giveaways</div>
                </Card>
              </div>

              {/* Giveaways Table */}
              <Card className="bg-[#0D0B26]/80 border border-gray-800/50 mb-8 overflow-hidden">
                <div className="p-6 border-b border-gray-800/50">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">All Giveaways</h3>
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-700 text-gray-300 bg-black hover:bg-white hover:text-black"
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <div className="relative">
                        <select
                          className="bg-[#0D0B26] border border-gray-700 px-3 py-2 rounded-md appearance-none pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#F7984A]/50 text-gray-200"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="all">All Status</option>
                          <option value="active">Active</option>
                          <option value="upcoming">Upcoming</option>
                          <option value="ended">Ended</option>
                        </select>
                        <ChevronDown className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50 text-left">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Giveaway
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Dates</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Entries
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Views</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {filteredGiveaways.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-300">
                            No giveaways found with the selected filter.
                          </td>
                        </tr>
                      ) : (
                        filteredGiveaways.map((giveaway) => (
                          <tr
                            key={giveaway.id}
                            className={cn(
                              "hover:bg-gray-800/30 transition duration-150",
                              selectedGiveaway?.id === giveaway.id && "bg-gray-800/20",
                            )}
                          >
                            <td className="px-6 py-4">
                              <div className="font-medium text-white">{giveaway.title}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-300">
                              <div>{giveaway.startDate}</div>
                              <div>{giveaway.endDate}</div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={`px-2 py-1 capitalize ${getStatusColor(giveaway.status)} border`}>
                                {giveaway.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-gray-300">{giveaway.entries.toLocaleString()}</td>
                            <td className="px-6 py-4 text-gray-300">{giveaway.views?.toLocaleString() || "N/A"}</td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 p-0"
                                  title="View Entries"
                                  onClick={() => handleSelectGiveaway(giveaway)}
                                >
                                  <Users className="h-4 w-4 text-blue-400" />
                                </Button>
                                <Link href={`/giveaways/${giveaway.slug}`} target="_blank">
                                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0" title="View Giveaway">
                                    <Eye className="h-4 w-4 text-gray-300" />
                                  </Button>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t border-gray-800/50 flex justify-between items-center">
                  <div className="text-sm text-gray-300">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">{filteredGiveaways.length}</span> of{" "}
                    <span className="font-medium">{filteredGiveaways.length}</span> entries
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                      disabled
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700 bg-[#F7984A] hover:bg-[#F7984A]/90 text-white"
                    >
                      1
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                      disabled
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Entries for Selected Giveaway */}
              {selectedGiveaway && (
                <Card className="bg-[#0D0B26]/80 border border-gray-800/50 overflow-hidden">
                  <div className="p-6 border-b border-gray-800/50">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-white">Entries: {selectedGiveaway.title}</h3>
                      <div className="flex space-x-3">
                        <Button
                          className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white"
                          onClick={handlePickWinner}
                          disabled={pickingWinner || entries.length === 0 || selectedGiveaway.status !== "ended"}
                        >
                          {pickingWinner ? (
                            <>
                              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Selecting...
                            </>
                          ) : (
                            <>
                              <Trophy className="h-4 w-4 mr-2" />
                              Pick Winner
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {selectedGiveaway.status !== "ended" && (
                    <div className="mx-6 my-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-yellow-400 mr-3">⚠️</div>
                        <div>
                          <p className="text-gray-300">
                            You can only pick a winner after the giveaway has ended.
                            {selectedGiveaway.status === "active"
                              ? ` This giveaway will end on ${selectedGiveaway.endDate}.`
                              : ` This giveaway hasn't started yet.`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Winner Announcement with Enhanced Notify Options */}
                  {winner && (
                    <div className="mx-6 my-4 p-4 bg-[#F7984A]/20 border border-[#F7984A]/30 rounded-lg">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center">
                          <Trophy className="h-5 w-5 text-[#F7984A] mr-3" />
                          <div>
                            <h4 className="font-bold text-white">Winner Selected!</h4>
                            <p className="text-gray-300">
                              Congratulations to {winner.name} ({winner.email})
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            className="border-[#F7984A] text-[#F7984A] hover:bg-[#F7984A]/10"
                            onClick={() => handleNotifyWinner(winner)}
                            disabled={notifying}
                          >
                            {notifying ? (
                              <>
                                <div className="h-4 w-4 border-2 border-[#F7984A] border-t-transparent rounded-full animate-spin mr-2"></div>
                                Notifying...
                              </>
                            ) : (
                              <>
                                {notificationSent ? (
                                  <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Notified
                                  </>
                                ) : (
                                  <>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Email Winner
                                  </>
                                )}
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            className="border-gray-700 bg-black hover:bg-gray-800 text-gray-300"
                            onClick={() => {
                              navigator.clipboard.writeText(winner.email)
                              setCopiedEmail(true)
                              setTimeout(() => setCopiedEmail(false), 2000)
                            }}
                          >
                            {copiedEmail ? (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Email
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {entriesLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block w-8 h-8 border-4 border-[#F7984A] border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-300">Loading entries...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-800/50 text-left">
                          <tr>
                            <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                              IP Address
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                          {entries.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-6 py-8 text-center text-gray-300">
                                No entries found for this giveaway.
                              </td>
                            </tr>
                          ) : (
                            currentEntries.map((entry) => (
                              <tr
                                key={entry.id}
                                className={cn(
                                  "hover:bg-gray-800/30 transition duration-150",
                                  winner?.id === entry.id && "bg-[#F7984A]/10",
                                )}
                              >
                                <td className="px-6 py-4 text-gray-300">{entry.id}</td>
                                <td className="px-6 py-4 text-white">{entry.name}</td>
                                <td className="px-6 py-4 text-gray-300">{entry.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-300">
                                  {new Date(entry.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-300">{entry.ip}</td>
                                <td className="px-6 py-4">
                                  <Badge
                                    className={`px-2 py-1 ${entry.verified ? "text-green-500 bg-green-500/20 border-green-500" : "text-yellow-500 bg-yellow-500/20 border-yellow-500"} border`}
                                  >
                                    {entry.verified ? "Verified" : "Pending"}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4">
                                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4 text-gray-300" />
                                  </Button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="p-4 border-t border-gray-800/50 flex justify-between items-center">
                    <div className="text-sm text-gray-300">
                      Showing <span className="font-medium">{entries.length > 0 ? indexOfFirstEntry + 1 : 0}</span> to{" "}
                      <span className="font-medium">{Math.min(indexOfLastEntry, entries.length)}</span> of{" "}
                      <span className="font-medium">{entries.length}</span> entries
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-black text-gray-300 hover:bg-white hover:text-black"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      >
                        Previous
                      </Button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show pages around current page
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant="outline"
                            size="sm"
                            className={`border-gray-700 ${
                              currentPage === pageNum
                                ? "bg-[#F7984A] hover:bg-[#F7984A]/90 text-white"
                                : "bg-black text-gray-300 hover:bg-white hover:text-black"
                            }`}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-black text-gray-300 hover:bg-white hover:text-black"
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

