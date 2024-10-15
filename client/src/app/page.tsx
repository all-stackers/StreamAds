"use client"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Blocks, Zap, Shield, Users, ArrowRight, CheckCircle, Twitter } from "lucide-react"

export default function StreamADLandingPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-white relative overflow-hidden">
          <div className="absolute inset-0">
            <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="vertical-lines" width="32" height="32" patternUnits="userSpaceOnUse">
                  <line x1="32" y1="0" x2="32" y2="32" stroke="#e5e7eb" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#vertical-lines)" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[80%] h-[60%] bg-grid-blue-500/[0.2] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,white_30%,transparent_80%)]"></div>
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-12 lg:space-y-0 lg:space-x-12">
              <div className="space-y-8 lg:text-left">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Revolutionize Your Digital Marketing
                </h1>
                <p className="mx-auto lg:mx-0 max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  StreamAD offers blockchain-powered tweet promotion campaigns with unparalleled transparency and accountability.
                </p>
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => router.push("onboarding/company")}>
                    Company
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => router.push("/user/campaign")}>
                    Influencers
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="relative w-full max-w-lg">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                <div className="relative">
                  <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-8">
                    <Twitter className="h-12 w-12 text-blue-500 mb-4" />
                    <h3 className="text-2xl font-bold mb-4">Seamless Tweet Promotions</h3>
                    <p className="text-gray-600 mb-4">Create, manage, and track your campaigns with blockchain-powered transparency.</p>
                    {/* <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2" />
                      <span>10,000+ active influencers</span>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-lg">
                <Blocks className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Blockchain-Based</h3>
                <p className="text-gray-500">Ensure complete transparency and immutability in all transactions and campaign data.</p>
              </div>
              <div className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-lg">
                <Zap className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Seamless Campaigns</h3>
                <p className="text-gray-500">Create and manage tweet promotion campaigns effortlessly with our intuitive platform.</p>
              </div>
              <div className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-lg">
                <Shield className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Enhanced Security</h3>
                <p className="text-gray-500">Advanced protection for all participants, transactions, and campaign data.</p>
              </div>
              <div className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-lg">
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Influencer Network</h3>
                <p className="text-gray-500">Connect with a vast network of influencers to amplify your marketing reach.</p>
              </div>
              <div className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-lg">
                <CheckCircle className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Reward System</h3>
                <p className="text-gray-500">Incentivize participation with our fair and transparent reward distribution system.</p>
              </div>
              <div className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-lg">
                <ArrowRight className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Real-time Analytics</h3>
                <p className="text-gray-500">Track campaign performance and ROI with our comprehensive analytics dashboard.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              How StreamAD Works
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center text-2xl font-bold mb-4">1</div>
                <h3 className="text-xl font-bold mb-2">Create Campaign</h3>
                <p className="text-gray-500">Companies set up tweet promotion campaigns on StreamAD, defining goals and rewards.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center text-2xl font-bold mb-4">2</div>
                <h3 className="text-xl font-bold mb-2">Influencer Participation</h3>
                <p className="text-gray-500">Influencers and communities join campaigns and promote content through tweets.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 text-white flex items-center justify-center text-2xl font-bold mb-4">3</div>
                <h3 className="text-xl font-bold mb-2">Earn Rewards</h3>
                <p className="text-gray-500">Participants receive rewards for successful promotions, tracked on the blockchain.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="faqs" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-2">How does StreamAD ensure transparency?</h3>
                <p className="text-gray-500">StreamAD leverages blockchain technology to record all transactions and campaign data, making them immutable and publicly verifiable.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-2">Can anyone participate as an influencer?</h3>
                <p className="text-gray-500">Yes, StreamAD is open to all influencers and community members. However, campaigns may have specific requirements set by the companies.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-2">How are rewards distributed?</h3>
                <p className="text-gray-500">Rewards are automatically distributed based on predefined campaign metrics and are recorded on the blockchain for transparency.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Digital Marketing?
                </h2>
                <p className="mx-auto max-w-[600px] text-blue-100 md:text-xl">
                  Join StreamAD today and experience the future of transparent, accountable tweet promotions.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="flex-1 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit" variant="secondary">
                    Get Started
                  </Button>
                </form>
                <p className="text-xs text-blue-100">
                  By signing up, you agree to our{" "}
                  <Link className="underline underline-offset-2 hover:text-white" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 bg-gray-800 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">About StreamAD</h3>
              <p className="text-sm text-gray-400">StreamAD is revolutionizing digital marketing with blockchain-powered tweet promotion campaigns.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-1 text-sm">
                <li><Link className="hover:text-blue-400" href="#features">Features</Link></li>
                <li><Link className="hover:text-blue-400" href="#how-it-works">How It Works</Link></li>
                <li><Link className="hover:text-blue-400" href="#faqs">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Legal</h3>
              <ul className="space-y-1 text-sm">
                <li><Link className="hover:text-blue-400" href="#">Terms of Service</Link></li>
                <li><Link className="hover:text-blue-400" href="#">Privacy Policy</Link></li>
                <li><Link className="hover:text-blue-400" href="#">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Connect</h3>
              <ul className="space-y-1 text-sm">
                <li><Link className="hover:text-blue-400" href="#">Twitter</Link></li>
                <li><Link className="hover:text-blue-400" href="#">LinkedIn</Link></li>
                <li><Link className="hover:text-blue-400" href="#">Facebook</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">© 2024 StreamAD. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link className="text-sm text-gray-400 hover:text-blue-400" href="#">
                Terms of Service
              </Link>
              <Link className="text-sm text-gray-400 hover:text-blue-400" href="#">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}