import { ulid } from "npm:ulid@3.0.1";

type ActivityProps = {
  id: string;
  name: string;
};

export class Activity {
  readonly id: string;
  readonly name: string;

  private constructor(props: ActivityProps) {
    const name = props.name.trim();

    if (!name) {
      throw new Error("Activity name is required.");
    }

    this.id = props.id;
    this.name = name;
  }

  static create(name: string): Activity {
    return new Activity({
      id: ulid(),
      name
    });
  }

  static rehydrate(props: ActivityProps): Activity {
    return new Activity(props);
  }
}

