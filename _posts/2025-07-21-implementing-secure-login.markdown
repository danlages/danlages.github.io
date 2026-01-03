---
layout: post
title:  "Implementing an intuitive and secure login method within an agile engineering environment"
date:   2025-07-21 10:00:00 +0100
categories: authentication ios agile
---

As with any platform, login is a crucial part of the user journey, allowing them to enjoy a more personalized ordering experience. Optimising this flow such that it is more secure and easy to use is a key undertaking and one that has been achieved with the rollout of the Passwordless Authentication feature.

With the new flow, we are removing the need to login with passwords, leveraging email verification. We will require a user to use a one time password in order to complete their login journey. This article will explain the processes adopted for the implementation of this feature in an agile development environment, with insights into how to work within a team to deliver a new feature of this scale.

![The new JustEatTakeaway login screen](/assets/images/posts/login-screen.jpg)
*The new JustEatTakeaway login screen*

## Plan

At a high level, this appears obvious but there are a lot of elements that go into the planning phase in a team that has many stakeholders and components.

In a full stack team, you may be collectively responsible for a range of components across different clients. For example, in this case, we mirrored the implementation of the passwordless flow on iOS and Android platforms. As such, aligning on these in the planning phase will speed up implementation.

During the initial phase, we need to identify which work items can be reused or mirrored for different clients. This approach promotes better alignment, allows for shared implementation details, and establishes consistent naming conventions in the code, all of which will streamline future communication.

## Communication with Stakeholders

The key to delivering any project is aligning with key stakeholders on progress. Typically, in mature engineering teams, this is often achieved through agile ceremonies. However, involving them in the planning process allows for more evidenced reasoning behind timescales.

Through writing and estimating tickets, you can use the data to provide clear estimates based on prior velocity and current complexity of work. This will allow the stakeholders (whether a product manager or another engineer) to communicate upwards with a clear picture of the work involved. As discussed earlier, aligning with clients will allow you to represent this work with clarity.

## Adopting a leadership role as an engineer on a project

As someone assuming a leadership position in the team you may be in a position of leadership in regards to the engineering effort. This often entails collaborating and steering other engineers to reach the common goal.

## Assessing the level of involvement

In teams in which work items are ticketed, consider writing tickets that describe, with good detail as to the work that needs to be actioned. This could include prescriptive steps, or simple guidance.

The best attribute in this situation is adaptability. Assess what the engineers in the team need and outline work or collaborate with the right level of abstraction. The focus should be fostering an environment for growth on these projects and learning in a collaborative space, even when things don't go to plan.

## Encouraging growth

Often there may be a tendency to complete tickets quickly as an engineer with domain knowledge. If the situation allows, focus on sharing that knowledge. Actioning items in collaboration allows engineers to be exposed to new processes or tasks that they may perceive as requiring experience.

Set up meetings to discuss the design and implementation, leading where required but enabling others to do so.

Often this role requires pragmatism, the judgement to determine if the time spent on a certain implementation detail is optimal when compared with the wider missions statement. Making these decisions and communicating them is key.

These behaviours have a full circle effect and allows for growth ahead of the next project.
