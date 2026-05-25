// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import {
    AppShell,
    Burger,
    createTheme,
    Group,
    type MantineColorsTuple,
    MantineProvider,
    ThemeIcon,
    Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import {
    ArticleIcon,
    ChartLineIcon,
    CpuIcon,
    GearIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import OpenBMSSVG from "@/assets/favicon.svg";
import { Aside } from "@/components/Aside";
import { ConnectionGroup } from "@/components/ConnectionGroup";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { Navbar } from "@/components/Navbar";
import { GraphsView } from "@/components/views/GraphsView";
import { LogsView } from "@/components/views/LogsView";
import { RegistersView } from "@/components/views/RegistersView";
import { SettingsView } from "@/components/views/SettingsView";

const purple: MantineColorsTuple = [
    "#f5efff",
    "#e4dcf6",
    "#c6b7e5",
    "#a690d4",
    "#8b6ec6",
    "#7c5cbf",
    "#714ebb",
    "#603fa5",
    "#553894",
    "#492f84",
];

const theme = createTheme({
    colors: {
        purple,
    },
    primaryColor: "purple",
});

// #8c5cf5 openbat purple
const views = [
    { icon: CpuIcon, label: "Registers", element: RegistersView },
    { icon: ChartLineIcon, label: "Graphs", element: GraphsView },
    { icon: ArticleIcon, label: "Logs", element: LogsView },
    { icon: GearIcon, label: "Settings", element: SettingsView },
];

export default function App() {
    const [opened, { toggle }] = useDisclosure();
    const [viewIndex, setViewIndex] = useState(0);
    const ActiveView = views[viewIndex].element;

    return (
        <MantineProvider defaultColorScheme="dark" theme={theme}>
            <Notifications />
            <AppShell
                padding="md"
                header={{ height: 60 }}
                footer={{ height: 20 }}
                navbar={{
                    width: 48,
                    breakpoint: "sm",
                    collapsed: { mobile: !opened },
                }}
                aside={{
                    width: 300,
                    breakpoint: "sm",
                    collapsed: { mobile: !opened },
                }}
            >
                <AppShell.Header>
                    <Group justify="space-between" h="100%">
                        <Group gap="sm" h="100%">
                            <Burger
                                opened={opened}
                                onClick={toggle}
                                hiddenFrom="sm"
                                size="sm"
                            />

                            <ThemeIcon size={48} color="transparent">
                                <img
                                    src={OpenBMSSVG}
                                    style={{ width: "90%", height: "90%" }}
                                    alt="OpenBMS Logo"
                                ></img>
                            </ThemeIcon>
                            <Title order={2}>OpenBMS Studio</Title>
                        </Group>
                        <Group></Group>
                        <ConnectionGroup />
                    </Group>
                </AppShell.Header>

                <AppShell.Navbar>
                    <Navbar
                        items={views}
                        activeItemIndex={viewIndex}
                        onItemIndexChange={setViewIndex}
                    />
                </AppShell.Navbar>

                <AppShell.Main>
                    <ActiveView />
                </AppShell.Main>
                <AppShell.Footer pl="md">
                    <ConnectionStatus />
                </AppShell.Footer>
                <AppShell.Aside>
                    <Aside />
                </AppShell.Aside>
            </AppShell>
        </MantineProvider>
    );
}
