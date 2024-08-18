import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { AmadeusHotelOffer } from "@/socket/chat";

const notifications = [
	{
		title: "Your call has been confirmed.",
		description: "1 hour ago",
	},
	{
		title: "You have a new message!",
		description: "1 hour ago",
	},
	{
		title: "Your subscription is expiring soon!",
		description: "2 hours ago",
	},
];

type CardProps = {
	hotel: AmadeusHotelOffer;
};

export function HotelCard(props: CardProps) {
	return (
		<Card className={cn("w-[380px] shrink-0")}>
			<CardHeader>
				<CardTitle>{props.hotel.name}</CardTitle>
				<CardDescription>{props.hotel.address.countryCode}</CardDescription>
			</CardHeader>

			<CardFooter>
				<Button className="w-full">Get more details</Button>
			</CardFooter>
		</Card>
	);
}
