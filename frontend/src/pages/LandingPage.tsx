import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { ArrowRight, TrendingUp, Shield, Globe, DollarSign, Building2, Coins, Zap, Factory, TreePine, Bitcoin, FileText } from 'lucide-react'

export function LandingPage() {
  const investmentCategories = [
    {
      name: "Stocks & Equities",
      description: "Growth-oriented investments in emerging markets, tech innovation, and small-cap opportunities",
      returns: "12-18%",
      risk: "Medium-High",
      icon: TrendingUp,
      keyAreas: ["Emerging Market Stocks", "Tech & Innovation", "Small-Cap Growth"]
    },
    {
      name: "Private Equity",
      description: "Investments in private companies with buyouts, growth capital, and distressed asset strategies",
      returns: "15-25%",
      risk: "High",
      icon: Building2,
      keyAreas: ["Company Buyouts", "Growth Capital", "Asset Turnarounds"]
    },
    {
      name: "Venture Capital",
      description: "Early-stage funding for technology, healthcare, green energy, and fintech startups",
      returns: "10x+ Potential",
      risk: "Very High",
      icon: Zap,
      keyAreas: ["Tech Startups", "Healthcare Innovation", "Green Energy"]
    },
    {
      name: "Hedge Funds",
      description: "Complex strategies including long/short equity, global macro, and event-driven trades",
      returns: "15-20%",
      risk: "High",
      icon: Globe,
      keyAreas: ["Long/Short Equity", "Global Macro", "Event-Driven"]
    },
    {
      name: "Real Estate",
      description: "High-growth commercial real estate and development projects in emerging markets",
      returns: "12-20%",
      risk: "Medium",
      icon: Factory,
      keyAreas: ["Commercial Development", "Emerging Markets", "High IRR Projects"]
    },
    {
      name: "Commodities",
      description: "Gold, precious metals, oil & gas projects, and critical minerals for the future economy",
      returns: "8-15%",
      risk: "Medium",
      icon: Coins,
      keyAreas: ["Gold & Precious Metals", "Oil & Gas", "Critical Minerals"]
    },
    {
      name: "Cryptocurrencies",
      description: "Digital assets including Bitcoin, Ethereum, DeFi projects, and tokenized investments",
      returns: "8-20%+",
      risk: "Very High",
      icon: Bitcoin,
      keyAreas: ["Bitcoin & Ethereum", "DeFi Projects", "Tokenized Assets"]
    },
    {
      name: "High-Yield Bonds",
      description: "Corporate bonds with lower credit ratings but significantly higher interest returns",
      returns: "8-12%",
      risk: "Medium-High",
      icon: FileText,
      keyAreas: ["Corporate Bonds", "Junk Bonds", "Fixed Income"]
    },
    {
      name: "Renewable Energy",
      description: "Solar, wind, and hydro projects backed by government incentives and ESG focus",
      returns: "12-18%",
      risk: "Medium",
      icon: TreePine,
      keyAreas: ["Solar Projects", "Wind Energy", "Infrastructure"]
    }
  ]

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white overflow-hidden">
        {/* Clear financial background with subtle warm lighting */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-slate-800/30 to-gray-900/50"></div>
          {/* Subtle warm bokeh light effects */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-yellow-400/12 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-orange-300/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/3 w-28 h-28 bg-amber-400/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/6 w-20 h-20 bg-yellow-500/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-1/2 right-1/6 w-36 h-36 bg-orange-400/8 rounded-full blur-3xl"></div>
        </div>

        {/* Very prominent city skyline silhouettes */}
        <div className="absolute bottom-0 left-0 right-0 h-80 opacity-80">
          <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center space-x-1">
            <div className="bg-black/95 w-8 h-40 shadow-2xl border-r border-gray-600/60"></div>
            <div className="bg-gray-900/98 w-12 h-56 shadow-2xl border-r border-gray-500/60"></div>
            <div className="bg-black/95 w-8 h-48 shadow-2xl border-r border-gray-600/60"></div>
            <div className="bg-gray-800/98 w-16 h-72 shadow-2xl border-r border-gray-500/60"></div>
            <div className="bg-black/95 w-10 h-60 shadow-2xl border-r border-gray-600/60"></div>
            <div className="bg-gray-900/98 w-14 h-80 shadow-2xl border-r border-gray-500/60"></div>
            <div className="bg-black/95 w-8 h-52 shadow-2xl border-r border-gray-600/60"></div>
            <div className="bg-gray-900/95 w-12 h-64 shadow-2xl border-r border-gray-500/60"></div>
            <div className="bg-black/95 w-10 h-56 shadow-2xl border-r border-gray-600/60"></div>
            <div className="bg-gray-800/98 w-18 h-68 shadow-2xl border-r border-gray-500/60"></div>
            <div className="bg-black/95 w-8 h-44 shadow-2xl border-r border-gray-600/60"></div>
            <div className="bg-gray-900/95 w-14 h-76 shadow-2xl border-r border-gray-500/60"></div>
            <div className="bg-black/95 w-10 h-60 shadow-2xl border-r border-gray-600/60"></div>
            <div className="bg-gray-900/98 w-12 h-48 shadow-2xl border-r border-gray-500/60"></div>
            <div className="bg-black/95 w-8 h-56 shadow-2xl border-r border-gray-600/60"></div>
            <div className="bg-gray-900/95 w-16 h-72 shadow-2xl border-r border-gray-500/60"></div>
            <div className="bg-black/95 w-10 h-64 shadow-2xl border-r border-gray-600/60"></div>
            <div className="bg-gray-800/98 w-14 h-52 shadow-2xl border-r border-gray-500/60"></div>
            <div className="bg-black/95 w-8 h-60 shadow-2xl border-r border-gray-600/60"></div>
            <div className="bg-gray-900/95 w-12 h-48 shadow-2xl border-r border-gray-500/60"></div>
            <div className="bg-black/95 w-10 h-44 shadow-2xl border-r border-gray-600/60"></div>
            <div className="bg-gray-900/98 w-16 h-68 shadow-2xl border-r border-gray-500/60"></div>
          </div>
          {/* Very bright building window lights */}
          <div className="absolute bottom-16 left-20 w-2 h-2 bg-yellow-300 opacity-95 rounded-full shadow-lg"></div>
          <div className="absolute bottom-24 left-32 w-1.5 h-1.5 bg-yellow-300 opacity-90 rounded-full shadow-lg"></div>
          <div className="absolute bottom-32 left-48 w-2 h-2 bg-yellow-300 opacity-95 rounded-full shadow-lg"></div>
          <div className="absolute bottom-20 left-64 w-1.5 h-1.5 bg-yellow-300 opacity-92 rounded-full shadow-lg"></div>
          <div className="absolute bottom-28 left-80 w-2 h-2 bg-yellow-300 opacity-88 rounded-full shadow-lg"></div>
          <div className="absolute bottom-36 left-96 w-1.5 h-1.5 bg-yellow-300 opacity-95 rounded-full shadow-lg"></div>
          <div className="absolute bottom-18 left-110 w-2 h-2 bg-yellow-300 opacity-90 rounded-full shadow-lg"></div>
          <div className="absolute bottom-26 left-130 w-1.5 h-1.5 bg-yellow-300 opacity-88 rounded-full shadow-lg"></div>
          <div className="absolute bottom-22 left-150 w-2 h-2 bg-yellow-300 opacity-93 rounded-full shadow-lg"></div>
          <div className="absolute bottom-30 left-170 w-1.5 h-1.5 bg-yellow-300 opacity-87 rounded-full shadow-lg"></div>
        </div>
        
        {/* Very clear and prominent World Map Overlay */}
        <div className="absolute inset-0 flex items-center justify-end pr-8 opacity-60">
          <svg width="600" height="400" viewBox="0 0 600 400" className="max-w-full h-auto">
            <defs>
              <linearGradient id="veryCleanWorldMapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#ffffff', stopOpacity:0.9}} />
                <stop offset="50%" style={{stopColor:'#f8fafc', stopOpacity:0.7}} />
                <stop offset="100%" style={{stopColor:'#f1f5f9', stopOpacity:0.6}} />
              </linearGradient>
            </defs>
            
            {/* World continents - very clear and prominent */}
            {/* North America */}
            <path d="M80 120 Q100 100 140 110 Q180 105 200 120 Q220 140 210 160 Q200 180 180 190 Q160 200 140 195 Q120 185 100 170 Q85 150 80 120 Z" 
                  fill="url(#veryCleanWorldMapGrad)" opacity="0.9" stroke="#ffffff" strokeWidth="1.5"/>
            
            {/* South America */}
            <path d="M120 200 Q140 190 160 200 Q180 210 185 240 Q190 270 180 300 Q170 320 150 325 Q130 320 120 300 Q115 270 120 240 Q118 220 120 200 Z" 
                  fill="url(#veryCleanWorldMapGrad)" opacity="0.9" stroke="#ffffff" strokeWidth="1.5"/>
            
            {/* Europe */}
            <path d="M240 100 Q260 95 280 100 Q300 105 310 120 Q315 135 305 145 Q295 155 280 150 Q265 145 250 140 Q240 125 240 100 Z" 
                  fill="url(#veryCleanWorldMapGrad)" opacity="0.9" stroke="#ffffff" strokeWidth="1.5"/>
            
            {/* Africa */}
            <path d="M250 150 Q270 145 290 155 Q310 165 315 190 Q320 220 310 250 Q300 275 285 285 Q270 290 255 285 Q245 275 240 250 Q235 220 240 190 Q245 170 250 150 Z" 
                  fill="url(#veryCleanWorldMapGrad)" opacity="0.9" stroke="#ffffff" strokeWidth="1.5"/>
            
            {/* Asia */}
            <path d="M320 90 Q360 85 400 95 Q440 105 470 120 Q490 140 485 165 Q480 190 460 200 Q440 205 420 200 Q400 195 380 185 Q360 175 340 160 Q325 140 320 115 Q318 100 320 90 Z" 
                  fill="url(#veryCleanWorldMapGrad)" opacity="0.9" stroke="#ffffff" strokeWidth="1.5"/>
            
            {/* Australia */}
            <path d="M420 240 Q450 235 480 245 Q500 255 505 270 Q500 285 485 290 Q470 295 450 290 Q430 285 420 270 Q415 255 420 240 Z" 
                  fill="url(#veryCleanWorldMapGrad)" opacity="0.9" stroke="#ffffff" strokeWidth="1.5"/>
            
            {/* Very clear global connection network */}
            <g opacity="0.9">
              {/* Very bright connection points */}
              <circle cx="150" cy="150" r="4" fill="#fbbf24" opacity="1"/>
              <circle cx="275" cy="125" r="4" fill="#fbbf24" opacity="1"/>
              <circle cx="275" cy="200" r="4" fill="#fbbf24" opacity="1"/>
              <circle cx="400" cy="140" r="4" fill="#fbbf24" opacity="1"/>
              <circle cx="450" cy="265" r="4" fill="#fbbf24" opacity="1"/>
              
              {/* Very clear connection lines */}
              <line x1="150" y1="150" x2="275" y2="125" stroke="#fbbf24" strokeWidth="2" opacity="0.8"/>
              <line x1="275" y1="125" x2="400" y2="140" stroke="#fbbf24" strokeWidth="2" opacity="0.8"/>
              <line x1="275" y1="200" x2="400" y2="140" stroke="#fbbf24" strokeWidth="2" opacity="0.8"/>
              <line x1="400" y1="140" x2="450" y2="265" stroke="#fbbf24" strokeWidth="2" opacity="0.8"/>
              <line x1="150" y1="150" x2="275" y2="200" stroke="#fbbf24" strokeWidth="2" opacity="0.7"/>
              
              {/* Very clear curved connection lines */}
              <path d="M150 150 Q200 100 275 125" stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0.7"/>
              <path d="M275 125 Q350 80 400 140" stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0.7"/>
              <path d="M400 140 Q425 180 450 265" stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0.7"/>
            </g>
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Gateway to{' '}
              <span className="text-yellow-400">Global Investment</span>{' '}
              Excellence
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-blue-100">
              Up to 14% ROI • Global Markets
            </p>
            <p className="text-lg mb-8 text-blue-200">
              Access premium investment opportunities across 9 diverse sectors with professional portfolio management and transparent reporting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/register">
                <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-400 px-8 py-3 font-semibold">
                  Start Investing Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-3">
                  View Performance
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 mb-12 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-yellow-400" />
                <span className="text-blue-200">Secure & Regulated</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-yellow-400" />
                <span className="text-blue-200">Global Markets</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-yellow-400" />
                <span className="text-blue-200">Proven Returns</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">$50M+</div>
                <div className="text-sm text-blue-200">Assets Under Management</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">2,500+</div>
                <div className="text-sm text-blue-200">Active Investors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">50+</div>
                <div className="text-sm text-blue-200">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Diversified Investment <span className="text-yellow-500">Portfolio</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access premium investment opportunities across 9 carefully selected sectors, each offering unique growth potential and risk profiles.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {investmentCategories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-100 rounded-lg p-2">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold">{category.name}</CardTitle>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-green-600 font-semibold">{category.returns} ROI</span>
                          <span className="text-gray-500">• {category.risk}</span>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Key Areas:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {category.keyAreas.map((area, areaIndex) => (
                          <li key={areaIndex} className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">Ready to build a diversified portfolio with professional management?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button className="bg-slate-900 hover:bg-slate-800 px-8 py-3">
                  Start Your Investment Journey
                </Button>
              </Link>
              <Button variant="outline" className="px-8 py-3">
                Download Portfolio Guide
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Investment <span className="text-yellow-500">Calculator</span>
            </h2>
            <p className="text-xl text-gray-600">
              Calculate your potential returns with our investment portfolios
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Investment Parameters
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Amount ($)
                    </label>
                    <input 
                      type="number" 
                      defaultValue="10000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum investment: $1,000</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Duration (months)
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="12">12 months</option>
                      <option value="24">24 months</option>
                      <option value="36">36 months</option>
                      <option value="60">60 months</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio Type
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="balanced">Balanced Portfolio</option>
                      <option value="growth">Growth Portfolio</option>
                      <option value="conservative">Conservative Portfolio</option>
                    </select>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Projected Returns
                </h3>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">$11,290.58</div>
                    <div className="text-sm text-gray-600">Total Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-500">$1,290.58</div>
                    <div className="text-sm text-gray-600">Total Profit</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold">Initial Investment</div>
                      <div className="text-gray-600">$10,000</div>
                    </div>
                    <div>
                      <div className="font-semibold">Monthly Profit</div>
                      <div className="text-gray-600">$107.55</div>
                    </div>
                    <div>
                      <div className="font-semibold">Annual ROI</div>
                      <div className="text-gray-600">12.9%</div>
                    </div>
                    <div>
                      <div className="font-semibold">Risk Level</div>
                      <div className="text-gray-600">Medium</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Performance <span className="text-yellow-500">Dashboard</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real-time metrics and portfolio performance across all investment sectors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">14.2%</div>
              <div className="text-sm text-gray-600">Total Returns</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">$52.3M</div>
              <div className="text-sm text-gray-600">Assets Under Management</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">2,847</div>
              <div className="text-sm text-gray-600">Active Investors</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">52</div>
              <div className="text-sm text-gray-600">Countries</div>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Portfolio Performance by Sector</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Private Equity</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">22%</span>
                    <span className="text-sm text-green-600">+18.5%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Venture Capital</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">18%</span>
                    <span className="text-sm text-green-600">+24.2%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Real Estate</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">15%</span>
                    <span className="text-sm text-green-600">+16.8%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Stocks & Equities</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">20%</span>
                    <span className="text-sm text-green-600">+14.3%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Renewable Energy</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">12%</span>
                    <span className="text-sm text-green-600">+15.7%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Other Sectors</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">13%</span>
                    <span className="text-sm text-green-600">+12.1%</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Investment Highlights</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-sm">Consistent Growth</div>
                    <div className="text-xs text-gray-600">14 consecutive quarters of positive returns</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-sm">Risk Management</div>
                    <div className="text-xs text-gray-600">Advanced portfolio diversification strategies</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-sm">Global Diversification</div>
                    <div className="text-xs text-gray-600">Investments across 52 countries worldwide</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-sm">Technology Integration</div>
                    <div className="text-xs text-gray-600">AI-powered investment analysis and optimization</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About <span className="text-yellow-500">Ajmal Investments</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your trusted partner in global investment excellence with over 15 years of proven expertise
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                To democratize access to premium investment opportunities worldwide, providing our clients with 
                professionally managed portfolios that deliver consistent returns while maintaining the highest 
                standards of security and transparency.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">15+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">$1B+</div>
                  <div className="text-sm text-gray-600">Total Investments</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <div className="font-semibold">Regulated & Secure</div>
                    <div className="text-sm text-gray-600">Licensed and regulated by international financial authorities</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <div className="font-semibold">Proven Expertise</div>
                    <div className="text-sm text-gray-600">Track record of consistent returns across market cycles</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <div className="font-semibold">Global Reach</div>
                    <div className="text-sm text-gray-600">Investment opportunities across emerging and developed markets</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-orange-600 mt-1" />
                  <div>
                    <div className="font-semibold">Client-Focused</div>
                    <div className="text-sm text-gray-600">Personalized service with dedicated account management</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Card className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Client Advantages</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="font-semibold text-sm mb-1">Professional Management</div>
                <div className="text-xs text-gray-600">Expert portfolio management by certified professionals</div>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div className="font-semibold text-sm mb-1">Transparent Fees</div>
                <div className="text-xs text-gray-600">Clear, competitive fee structure with no hidden costs</div>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="font-semibold text-sm mb-1">Real-Time Tracking</div>
                <div className="text-xs text-gray-600">24/7 portfolio monitoring and performance reporting</div>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <div className="font-semibold text-sm mb-1">Risk Management</div>
                <div className="text-xs text-gray-600">Advanced risk assessment and mitigation strategies</div>
              </div>
              <div className="text-center">
                <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Globe className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="font-semibold text-sm mb-1">Global Access</div>
                <div className="text-xs text-gray-600">Access to exclusive international investment opportunities</div>
              </div>
              <div className="text-center">
                <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="h-6 w-6 text-red-600" />
                </div>
                <div className="font-semibold text-sm mb-1">Flexible Minimums</div>
                <div className="text-xs text-gray-600">Low minimum investments starting from $1,000</div>
              </div>
            </div>
          </Card>
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

      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-xl mb-8 text-slate-300">
            Join our global community of investors and start building your wealth today
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-400 px-8 py-3 font-semibold">
              Create Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
                <img 
                  src="/ajmal-logo.jpeg" 
                  alt="Ajmal Investments PLC" 
                  className="h-10 w-10 rounded-full object-cover mr-3"
                />
                <div>
                  <h3 className="text-xl font-bold">Ajmal Investments PLC</h3>
                </div>
              </div>
              <p className="text-slate-300 mb-4">
                Premier international investment firm delivering exceptional returns through diversified portfolio management.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-yellow-400" />
                  <span className="text-slate-300">Global Headquarters</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-yellow-400" />
                  <span className="text-slate-300">52 Countries Worldwide</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/investments" className="text-slate-300 hover:text-yellow-400 transition-colors">Investment Portfolio</Link></li>
                <li><Link to="/dashboard" className="text-slate-300 hover:text-yellow-400 transition-colors">Performance Dashboard</Link></li>
                <li><Link to="/" className="text-slate-300 hover:text-yellow-400 transition-colors">About Us</Link></li>
                <li><Link to="/" className="text-slate-300 hover:text-yellow-400 transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Investment Sectors */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Investment Sectors</h4>
              <ul className="space-y-2">
                <li><span className="text-slate-300">Stocks & Equities</span></li>
                <li><span className="text-slate-300">Private Equity</span></li>
                <li><span className="text-slate-300">Venture Capital</span></li>
                <li><span className="text-slate-300">Real Estate</span></li>
                <li><span className="text-slate-300">Cryptocurrencies</span></li>
                <li><span className="text-slate-300">Renewable Energy</span></li>
              </ul>
            </div>

            {/* Get Started */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Get Started</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-yellow-400" />
                  <a href="mailto:invest@ajmal.com" className="text-slate-300 hover:text-yellow-400 transition-colors">
                    invest@ajmal.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-yellow-400" />
                  <a href="tel:+15551234567" className="text-slate-300 hover:text-yellow-400 transition-colors">
                    +1 (555) 123-4567
                  </a>
                </div>
                <Link to="/register">
                  <Button className="bg-yellow-500 text-black hover:bg-yellow-400 mt-4 w-full">
                    Start Investing
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-slate-400 text-sm mb-4 md:mb-0">
                © 2024 Ajmal Investments PLC. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm">
                <Link to="/" className="text-slate-400 hover:text-yellow-400 transition-colors">Privacy Policy</Link>
                <Link to="/" className="text-slate-400 hover:text-yellow-400 transition-colors">Terms of Service</Link>
                <Link to="/" className="text-slate-400 hover:text-yellow-400 transition-colors">Risk Disclosure</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
