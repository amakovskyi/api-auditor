abstract class ITest {
  abstract test(actual, expected): any;
}

class TestImpl extends ITest {
  test(actual, expected): any {
    return 1;
  }
}

class NotTest {

}

describe('Type test', () => {

  it('Interface check', () => {
    expect(new TestImpl() instanceof ITest).toBeTruthy();
    expect(new NotTest() instanceof ITest).toBeFalsy();
  });

});