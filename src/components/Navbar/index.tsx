import classes from "@/components/Navbar/index.module.css";
import { ActionIcon, Stack, Tooltip } from "@mantine/core";
import { GearIcon } from "@phosphor-icons/react";
import { FC } from "react";

interface NavbarLinkProps {
	icon: typeof GearIcon;
	label: string;
	active?: boolean;
	onClick?: () => void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
	return (
		<Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
			<ActionIcon
				onClick={onClick}
				size="xl"
				variant="subtle"
				radius={0}
				className={classes.link}
				data-active={active || undefined}
				aria-label={label}
			>
				<Icon style={{ width: "70%", height: "70%" }} />
			</ActionIcon>
		</Tooltip>
	);
}

interface ViewDef {
	icon: typeof GearIcon;
	label: string;
	element: FC;
}

interface NavbarProps {
	items: ViewDef[];
	activeItemIndex: number;
	onItemIndexChange: (index: number) => void;
}

export function Navbar({
	items,
	activeItemIndex,
	onItemIndexChange,
}: NavbarProps) {
	const links = items.map((link, index) => (
		<NavbarLink
			{...link}
			key={link.label}
			active={index === activeItemIndex}
			onClick={() => onItemIndexChange(index)}
		/>
	));

	return (
		<Stack h="100%" justify="space-between" align="center">
			<Stack justify="center" gap={8}>
				{links.slice(0, -1)}
			</Stack>

			{links.slice(-1)}
		</Stack>
	);
}
