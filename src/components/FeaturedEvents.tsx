
import { ArrowRight } from "lucide-react";
import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Mock data for featured events
const featuredEvents = [
  {
    id: "1",
    title: "TechFest Hackathon",
    organizer: "Computer Science Association",
    date: "Nov 25, 2035",
    time: "9:00 AM - 12:30 PM",
    image: "https://www.sxsw.com/wp-content/uploads/2019/06/2019-Hackathon-Photo-by-Randy-and-Jackie-Smith.jpg",
    category: "Tech",
    teamSize: "2-4",
    registrationDeadline: "2035-11-23",
  },
  {
    id: "2",
    title: "BitNBuild Hackathon",
    organizer: "Google Developer Students Council",
    date: "June 2, 2035",
    time: "09:00 AM - 12:30 PM",
    image: "https://d8it4huxumps7.cloudfront.net/uploads/images/opportunity/mobile_banner/66bdd08f62ce0_bit-n-build-around-the-world-2024.webp",
    category: "Business",
    teamSize: "3-5",
    registrationDeadline: "2035-05-30",
  },
  {
    id: "3",
    title: "Euphoria",
    organizer: "Students Council",
    date: "April 30, 2025",
    time: "6:00 PM - 10:00 PM",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    category: "Cultural",
    teamSize: "Individual/Group",
    registrationDeadline: "2025-04-25",
  },
];

const FeaturedEvents = () => {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Events</h2>
          <Link to="/events">
            <Button variant="outline" className="flex items-center gap-2">
              View all <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedEvents;
