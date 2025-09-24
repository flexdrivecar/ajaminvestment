import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { ArrowRight, TrendingUp, Shield, Globe, DollarSign } from 'lucide-react'

export function LandingPage() {
  const investmentCategories = [
    {
      name: "Stocks & Equities",
      description: "Growth-oriented investments in emerging markets and tech innovation",
      returns: "8-15%",
      risk: "Medium-High"
    },
    {
      name: "Private Equity",
      description: "Investments in private companies through buyouts and growth capital",
      returns: "15-25%",
      risk: "High"
    },
    {
      name: "Venture Capital",
      description: "Early-stage funding for technology and healthcare startups",
      returns: "10-50%",
      risk: "Very High"
    },
    {
      name: "Real Estate",
      description: "Commercial real estate in rapidly developing cities",
      returns: "12-20%",
      risk: "Medium-High"
    },
    {
      name: "Cryptocurrencies",
      description: "Bitcoin, Ethereum, and DeFi projects with high yield potential",
      returns: "8-30%",
      risk: "Very High"
    },
    {
      name: "Renewable Energy",
      description: "Solar, wind, and hydro projects with government backing",
      returns: "12-18%",
      risk: "Medium"
    }
  ]

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              International Investment Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Diversified investment opportunities with up to 14% ROI
            </p>
            <p className="text-lg mb-12 text-blue-200 max-w-3xl mx-auto">
              Join thousands of global investors accessing premium investment categories including 
              Private Equity, Venture Capital, Real Estate, and Renewable Energy projects worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-3">
                  Start Investing Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Ajmal Investments?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional investment management with global reach and proven track record
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Access</h3>
              <p className="text-gray-600">
                Worldwide investment opportunities across emerging and developed markets
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">High Returns</h3>
              <p className="text-gray-600">
                Target returns up to 14% across diversified investment categories
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-gray-600">
                Bank-level security with KYC verification and encrypted transactions
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Low Minimums</h3>
              <p className="text-gray-600">
                Start investing from $1,000 in select categories
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Investment Categories
            </h2>
            <p className="text-xl text-gray-600">
              Diversified portfolio across 9 major investment categories
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {investmentCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Expected Returns</p>
                      <p className="text-lg font-semibold text-green-600">{category.returns}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Risk Level</p>
                      <p className="text-lg font-semibold">{category.risk}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join our global community of investors and start building your wealth today
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-3">
              Create Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
