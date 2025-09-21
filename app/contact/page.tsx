"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Calendar,
  Users,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    contactType: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Feature Not Available Yet",
      description:
        "Please send your message directly to info@starpops.com. We'll respond within 24 hours.",
      variant: "destructive",
    });
  };

  const contactTypes = [
    { value: "general", label: "General Inquiry", icon: MessageCircle },
    { value: "investment", label: "Investment Opportunity", icon: Users },
    { value: "partnership", label: "Partnership", icon: Users },
    { value: "media", label: "Media & Press", icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 text-balance">
            <span className="shimmer-text">Get in</span>{" "}
            <span className="text-primary">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Ready to join the Star Pops journey? Have questions about our
            business or investment opportunities? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full glow-border"></div>
                Send us a Message
              </CardTitle>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  Our contact form is currently under development. Please send
                  your message directly to:
                </p>
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary mb-1">
                      info@starpops.com
                    </div>
                    <div className="text-sm text-muted-foreground">
                      We respond within 24 hours
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  You can still use the form below to compose your message, but
                  it won't be submitted automatically.
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Type Selection */}
                <div className="space-y-3">
                  <Label className="text-lg">What can we help you with?</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {contactTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              contactType: type.value,
                            }))
                          }
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            formData.contactType === type.value
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent className="w-5 h-5" />
                            <span className="font-medium">{type.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name and Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-input/50 border-primary/30"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-input/50 border-primary/30"
                      required
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Brief description of your inquiry"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="bg-input/50 border-secondary/30"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more about your inquiry, questions, or how we can help you..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className="bg-input/50 border-primary/30 min-h-[120px]"
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full glow-border text-lg py-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      Copy & Send to info@starpops.com
                    </>
                  )}
                </Button>

                <div className="text-sm text-muted-foreground text-center">
                  Click the button above to be reminded to send your message to
                  info@starpops.com
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <Card className="glass-effect border-secondary/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <div className="w-6 h-6 bg-secondary rounded-full"></div>
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">info@starpops.com</p>
                    <p className="text-sm text-muted-foreground">
                      For general inquiries and support
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-muted-foreground">+233 XX XXX XXXX</p>
                    <p className="text-sm text-muted-foreground">
                      Available Mon-Fri, 9AM-6PM GMT
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-muted-foreground">KNUST Campus</p>
                    <p className="text-muted-foreground">Kumasi, Ghana</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Business Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 8AM - 6PM
                    </p>
                    <p className="text-muted-foreground">
                      Saturday: 10AM - 4PM
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Closed on Sundays
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start glow-border" size="lg">
                  <Calendar className="w-5 h-5 mr-3" />
                  Schedule a Meeting
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  size="lg"
                >
                  <Users className="w-5 h-5 mr-3" />
                  Investment Inquiry
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  size="lg"
                >
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Partnership Opportunities
                </Button>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="glass-effect border-secondary/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Fast Response Time</h3>
                  <p className="text-muted-foreground mb-4">
                    We pride ourselves on quick responses. Most inquiries are
                    answered within 24 hours.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Badge variant="secondary">24hr Response</Badge>
                    <Badge
                      variant="outline"
                      className="border-primary text-primary"
                    >
                      Professional Support
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-balance">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="glass-effect border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-primary mb-4">
                  How can I invest in Star Pops?
                </h3>
                <p className="text-muted-foreground">
                  Visit our Investment Portal to calculate potential returns and
                  generate a personalized investment proposal. Our minimum
                  investment is GHS 5,000 with attractive terms for early
                  investors.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-secondary/20">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-secondary mb-4">
                  Do you offer franchise opportunities?
                </h3>
                <p className="text-muted-foreground">
                  Yes! We're planning to expand to other universities across
                  Ghana. Contact us to learn about franchise opportunities and
                  partnership models for your campus.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-primary mb-4">
                  What makes Star Pops different?
                </h3>
                <p className="text-muted-foreground">
                  We focus on premium quality, innovative flavors, and
                  exceptional customer experience. Our proven business model and
                  strong financial performance set us apart from competitors.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-secondary/20">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-secondary mb-4">
                  Can I schedule a campus visit?
                </h3>
                <p className="text-muted-foreground">
                  We welcome potential investors and partners to visit our
                  operations at KNUST. Contact us to arrange a tour and see our
                  business in action.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <Card className="glass-effect border-primary/20 max-w-3xl mx-auto">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold mb-6">Ready to Connect?</h3>
              <p className="text-xl text-muted-foreground mb-8">
                Whether you're interested in investing, partnering, or just
                learning more about Star Pops, we're here to help make it
                happen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="glow-border text-lg px-8 py-4">
                  Start a Conversation
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent text-lg px-8 py-4"
                >
                  View Investment Portal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
