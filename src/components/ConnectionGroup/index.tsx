import { Group, NativeSelect, Button } from "@mantine/core";
import classes from "@/components/ConnectionGroup/index.module.css";

export function ConnectionGroup() {
    return <Group px="md" h="100%">
        <NativeSelect classNames={{root: classes.root, label: classes.label, wrapper: classes.wrapper }} label="Port" data={["COM1", "COM2", "COM3"]}/>
        <NativeSelect classNames={{root: classes.root, label: classes.label, wrapper: classes.wrapper }} label="Baud Rate" data={["115200"]}/>
        <Button>Connect</Button>
    </Group>
}