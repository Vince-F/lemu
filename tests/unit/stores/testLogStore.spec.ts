import testLogStore from "@/store/testLogStore";

describe("TestLogStore", () => {
  describe("addLog", () => {
    it("should add log", () => {
      jest.spyOn(globalThis.Date, "now")
        .mockImplementationOnce(() => {
          return new Date("2020-01-01T01:02:03.456Z").valueOf();
        });

      const state = {
        logs: []
      };
      if (testLogStore.mutations) {
        testLogStore.mutations.addLog(state, { message: "test", level: "info" });
      }

      expect(state.logs).toEqual([{ message: "test", level: "info", time: new Date("2020-01-01T01:02:03.456Z") }]);
    });
  });

  describe("resetLogs", () => {
    it("should empty the logs", () => {
      const state = {
        logs: [{ message: "test", level: "info", time: new Date() }]
      };
      if (testLogStore.mutations) {
        testLogStore.mutations.resetLogs(state);
      }

      expect(state.logs).toEqual([]);
    });
  });
});
