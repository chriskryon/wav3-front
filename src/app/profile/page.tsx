"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Save, User, MapPin, Phone, CreditCard, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  const [profileForm, setProfileForm] = useState({
    tax_id_number: "",
    tax_id_type: "",
    email: "",
    full_name: "",
    country: "",
    local_id_type: "",
    local_id_number: "",
    post_code: "",
    city: "",
    address: "",
    phone: "",
  })

  useEffect(() => {
    // Get user data from localStorage
    const user = localStorage.getItem("user")
    if (user) {
      const parsedUser = JSON.parse(user)
      setUserData(parsedUser)
      setProfileForm((prev) => ({
        ...prev,
        email: parsedUser.email || "",
        full_name: parsedUser.name || "",
      }))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update user data in localStorage
    const updatedUser = {
      ...userData,
      profileCompleted: true,
      profile: profileForm,
    }
    localStorage.setItem("user", JSON.stringify(updatedUser))

    toast.success("Profile completed successfully!")
    setIsLoading(false)
    router.push("/")
  }

  const countries = [
    { code: "BR", name: "Brazil" },
    { code: "MX", name: "Mexico" },
    { code: "AR", name: "Argentina" },
    { code: "CO", name: "Colombia" },
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
  ]

  const taxIdTypes = {
    BR: [
      { value: "CPF", label: "CPF" },
      { value: "CNPJ", label: "CNPJ" },
    ],
    MX: [{ value: "RFC", label: "RFC" }],
    AR: [{ value: "CUIT", label: "CUIT" }],
    CO: [{ value: "NIT", label: "NIT" }],
  }

  const localIdTypes = [
    { value: "passport", label: "Passport" },
    { value: "national_id", label: "National ID" },
    { value: "drivers_license", label: "Driver's License" },
    { value: "foreigner_id", label: "Foreigner ID Card" },
  ]

  return (
    <div className="content-height p-8 scroll-area bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-main">Complete Your Profile</h1>
          <p className="muted-text text-lg mt-2">Please provide your information to comply with KYC requirements</p>
        </div>

        <Card className="glass-card-enhanced">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-main flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-sm font-medium muted-text">
                    Full Name *
                  </Label>
                  <Input
                    id="full_name"
                    type="text"
                    placeholder="Enter your full name"
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                    className="glass-input h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium muted-text">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="glass-input h-12"
                    required
                  />
                </div>
              </div>

              {/* Country and Tax Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-main">Country & Tax Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-medium muted-text">
                      Country *
                    </Label>
                    <Select
                      value={profileForm.country}
                      onValueChange={(value) => setProfileForm({ ...profileForm, country: value, tax_id_type: "" })}
                    >
                      <SelectTrigger className="glass-input h-12">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="glass-card-enhanced">
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tax_id_type" className="text-sm font-medium muted-text">
                      Tax ID Type *
                    </Label>
                    <Select
                      value={profileForm.tax_id_type}
                      onValueChange={(value) => setProfileForm({ ...profileForm, tax_id_type: value })}
                      disabled={!profileForm.country}
                    >
                      <SelectTrigger className="glass-input h-12">
                        <SelectValue placeholder="Select tax ID type" />
                      </SelectTrigger>
                      <SelectContent className="glass-card-enhanced">
                        {profileForm.country &&
                          taxIdTypes[profileForm.country as keyof typeof taxIdTypes]?.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tax_id_number" className="text-sm font-medium muted-text">
                      Tax ID Number *
                    </Label>
                    <Input
                      id="tax_id_number"
                      type="text"
                      placeholder="Enter tax ID number"
                      value={profileForm.tax_id_number}
                      onChange={(e) => setProfileForm({ ...profileForm, tax_id_number: e.target.value })}
                      className="glass-input h-12"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Local ID Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-main">Local ID Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="local_id_type" className="text-sm font-medium muted-text">
                      Local ID Type
                    </Label>
                    <Select
                      value={profileForm.local_id_type}
                      onValueChange={(value) => setProfileForm({ ...profileForm, local_id_type: value })}
                    >
                      <SelectTrigger className="glass-input h-12">
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                      <SelectContent className="glass-card-enhanced">
                        {localIdTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="local_id_number" className="text-sm font-medium muted-text">
                      Local ID Number *
                    </Label>
                    <Input
                      id="local_id_number"
                      type="text"
                      placeholder="Enter ID number"
                      value={profileForm.local_id_number}
                      onChange={(e) => setProfileForm({ ...profileForm, local_id_number: e.target.value })}
                      className="glass-input h-12"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-main">Address Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium muted-text">
                      Address
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="Enter your address"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      className="glass-input h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium muted-text">
                      City
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="Enter your city"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      className="glass-input h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="post_code" className="text-sm font-medium muted-text">
                      Postal Code
                    </Label>
                    <Input
                      id="post_code"
                      type="text"
                      placeholder="Enter postal code"
                      value={profileForm.post_code}
                      onChange={(e) => setProfileForm({ ...profileForm, post_code: e.target.value })}
                      className="glass-input h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium muted-text">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 muted-text" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="pl-10 glass-input h-12"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto px-12 h-12 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Saving Profile...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Complete Profile
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
